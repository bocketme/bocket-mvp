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
async function doesHeHaveRights(io, userMail, nodeId) {
  const user = await User.findOne({ email: userMail });
  const node = await Node.findById(nodeId);

  if (!node) deleteInexistantNode(io, nodeId);

  if (!user || !node) return null;

  const [members, owners] = [node.team.members, node.team.owners];

  if (members.find(member => member.email === userMail) ||
    owners.find(member => member.email === userMail)) {
    return node;
  }
  return null;
}

async function deleteInexistantNode(io, nodeId) {
  const nodes = await Node.find({ 'children._id': nodeId });
  log.info(nodes.length);
  if (nodes.length === 0) return null
  log.info(`the node ${nodeId} is inexistant, deletion automatic...`);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.children = node.children.filter(child => child._id !== nodeId);
    await node.save();
  }
  log.info(`deletion successfull`);
  io.to(session.currentWorkspace).emit(socketName, nodeId);
  io.to(session.currentWorkspace).emit('[Viewer] - Delete', nodeId);
  return null
}

async function deleteNodeListener(io, session, nodeId) {
  try {
    const workspaces = await Workspace.find({
      'node_master._id': nodeId,
      _id: session.currentWorkspace,
    });
    if (workspaces.length > 0) throw Error('Node Master');

    const node = await doesHeHaveRights(io, session.userMail, nodeId);
    if (!node) throw Error('Node not Found');
    const { name } = node;
    if (node) {
      await node.remove();
      log.info(`the node ${name} is deleted.`);
      io.to(session.currentWorkspace).emit(socketName, nodeId);
      io.to(session.currentWorkspace).emit('[Viewer] - Delete', nodeId);
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
        try {
          socket.emit('error', 'Cannot delete the node');
        } catch (e) { console.error(e) }
      });
  });
};
