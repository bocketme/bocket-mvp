const Node = require('../../models/Node');
//TODO: ADD USER VERIFICATION !! const User = require('../../models/User');
const Workspace = require('../../models/Workspace');

const log = require('../../utils/log');

module.exports = async (io, socket) => {

  socket.on('[Node] - Delete', async function (nodeId) {
    try {
      const node = await Node.findById(nodeId);
      if (!node) throw new Error('[Node] - remove : Cannot find the node');

      const isNodeMaster = await Workspace.findOne({ "nodeMaster": node._id });
      if (isNodeMaster) return socket.emit('error', 'Cannot remove the node Master');

      const workspace = await Workspace.findById(node.Workspace);
      if (!workspace) throw new Error('[Node] -  remove : Cannot find the workspace');

      const { session } = socket.handshake;
      const rights = workspace.hasRights(session.userId);

      if (!rights || rights === 1)
        throw new Error('[Organization] - Cannot delete the node, user has no the necessary rights');

      await node.remove();
      io.to(session.currentWorkspace).emit('[Node] - Delete', nodeId);
      io.to(session.currentWorkspace).emit('[Viewer] - Delete', nodeId);
    } catch (err) {
      log.error(err);
      socket.emit('error', 'Cannot delete the node');
    }
  });
};
