const socketName = 'deleteNode';
const Node = require('../models/Node');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

const log = require('../utils/log');

/**
 * Check if the user can delete the node
 * @param userMail {string}
 * @param nodeId {string}
 * @return {Promise<void>}
 */
async function doesHeHaveRights(userMail, nodeId) {
  const user = await User.findOne({ email: userMail });
  const node = await Node.findById(nodeId);

  if (!user || !node) return null;

  /*
  * console.log("User's mail:", user.email);
  * console.log("Node's name:", node.name);
  */

  const [members, owners] = [node.team.members, node.team.owners];

  if (members.find(member => member.email === userMail) ||
    owners.find(member => member.email === userMail)) {
    return node;
  }
  return null;
}

async function deleteNodeListener(io, session, nodeId) {
  try {
    const workspaces = await Workspace.find({
      'node_master._id': nodeId,
      _id: session.currentWorkspace,
    });
    if (workspaces.length > 0) throw Error('Node Master');

    const node = await doesHeHaveRights(session.userMail, nodeId);
    if (!node) throw Error('Node not Found');
    const { name } = node;
    if (node) {
      await node.remove();
      log.info(`the node ${name} is deleted.`);
      io.to(session.currentWorkspace).emit(socketName, nodeId);
    }
  } catch (e) {
    throw e;
  }
}

module.exports = async (io, socket) => {
  socket.on(socketName, (nodeId) => {
    deleteNodeListener(io, socket.handshake.session, nodeId)
      .catch((e) => {
        log.error(e);
        socket.emit('error', 'Cannot delete the node');
      });
  });
};
