const socketName = 'deleteNode';
const Node = require('../models/Node');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Organization = require('../models/Organization');
const rimraf = require('rimraf');
const path = require('path');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const Fsconfig = require('../config/FileSystemConfig');

const log = require('../utils/log');
const appDir = path.dirname(require.main.filename);

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

async function deleteData(type, contentId) {
  let content;
  try {
    if (type === NodeTypeEnum.part) content = await Part.findById(contentId);
    else if (type === NodeTypeEnum.assembly) content = await Assembly.findById(contentId);
    else throw Error('The node is nor an Assembly nor a part');

    rimraf(path.join(Fsconfig.appDirectory.files3D, content.path), (err)=> { if(err) throw err; });
  } catch (err) {
    throw err;
  }
}

async function deleteNodeListener(io, session, nodeId) {
  try {
    const node = await doesHeHaveRights(session.userMail, nodeId);
    if (!node) throw Error('Node not Found');
    log.info(nodeId, node.name)
    const nodeParent = await Node.findOne({"children._id": nodeId});
    if (!nodeParent) throw Error('Node parent not found');

    const indexOfNodeId = nodeParent.children.map((child => child._id)).indexOf(node._id);
    nodeParent.children.splice(indexOfNodeId, 1);

    if (node) {
      await deleteData(node.type, node.content);
      await node.remove();
      await nodeParent.save();
      io.to(session.currentWorkspace).emit(socketName, nodeId);
    }
  } catch (e) {
    log.error(e);
  }
}

module.exports = async (io, socket) => {
  socket.on(socketName, (nodeId) => {
    deleteNodeListener(io, socket.handshake.session, nodeId);
  });
};