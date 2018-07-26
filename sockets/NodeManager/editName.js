const nodeSchema = require('../../models/Node');
const log = require('../../utils/log');
const nodeModel = require('../../models/Node');

module.exports = (io, socket) => {
  socket.on("[Node] - Update Name", async (nodeId) => {
    try {
      const { currentWorkspace } = socket.handshake.session;

      const node = await nodeModel.findById(nodeId);

      io.in(currentWorkspace).emit("[Node] - Update Name", nodeId, node.name);
    } catch (err) {
      log.warn("Cannot Update the name of the node");
      log.warn(err);
    }
  });
};
