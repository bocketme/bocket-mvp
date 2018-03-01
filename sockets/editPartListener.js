const listenerName = 'editPart';
const Path = require('path');
const Node = require('../models/Node');
const mv = require('mv');
const getContentOfNode = require('../utils/node/getContentOfNode');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const getNodeDataDirectory = require('../utils/node/getNodeDataDirectory');

async function editPart(newName, newDescription, nodeId, workspaceId) {
  const { node, content, type } = await getContentOfNode(nodeId);

  // console.log('editPart -> node: ', node);

  if (type === NodeTypeEnum.part) {
    const parentNode =
        await Node.findOne({ children: { $in: [{ _id: nodeId, type, name: node.name }] } });
    if (!parentNode) { throw Error('Unknown parent'); }

    node.name = newName;
    node.description = newDescription;
    content.name = newName;
    content.description = newDescription;

    const index = parentNode.children.findIndex(elem => elem._id === nodeId);

    parentNode.children[index].name = newName;

    const path = await getNodeDataDirectory(nodeId, workspaceId);
    const pathTokenized = path.split('/');
    const dataDirNameTokenized = pathTokenized[pathTokenized.length - 1].split(' - ');
    pathTokenized.pop();
    dataDirNameTokenized[0] = newName;
    const newPath = Path.join('/', ...pathTokenized, dataDirNameTokenized.join(' - '));
    mv(path, newPath, (err) => { console.log('EDIT PARTTTTTT: ', err)});
    console.log('PATH =======', path);

    await node.save();
    await content.save();
    await parentNode.save();
  }
}

module.exports = (socket) => {
  socket.on(listenerName, ({ name, description, nodeId }) => {
    console.log('name:', name, 'description:', description, 'nodeId:', nodeId);
    editPart(name, description, nodeId, socket.handshake.session.currentWorkspace)
        .then()
        .catch((err) => {
          console.log(`[${listenerName}] error: ${err}`);
        });
  });
};
