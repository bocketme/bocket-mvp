const socketName = 'deleteNode';
const Node = require('../models/Node');
const User = require('../models/User');

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
    const node = await doesHeHaveRights(session.userMail, nodeId);
    if (!node) return;
    const nodeParent = await Node.findById(node.parent);
    if (!nodeParent) return;

    const indexOfNodeId = nodeParent.children.map((child => child._id)).indexOf(node._id);
    nodeParent.children.splice(indexOfNodeId, 1);

    if (node) {
      await node.remove();
      await nodeParent.save();
      io.to(session.currentWorkspace).emit(socketName, nodeId);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = async (io, socket) => {
  socket.on(socketName, (nodeId) => {
    deleteNodeListener(io, socket.handshake.session, nodeId);
  });
};
