const listenerName = 'editPart';
const Node = require('../models/Node');
const getContentOfNode = require('../utils/node/getContentOfNode');
const NodeTypeEnum = require('../enum/NodeTypeEnum');

async function editPart(newName, newDescription, nodeId) {
  const { node, content, type } = await getContentOfNode(nodeId);

  //console.log('editPart -> node: ', node);

  if (type === NodeTypeEnum.part) {
    const parentNode = await Node.findOne({ children: { $in: [{ _id: nodeId, type, name: node.name }] } });
    if (!parentNode) { throw Error('Unknown parent'); }

    node.name = newName;
    node.description = newDescription;
    content.name = newName;
    content.description = newDescription;

    const index = parentNode.children.findIndex((elem) => elem._id === nodeId);

    parentNode.children[index].name = newName;

    await node.save();
    await content.save();
    await parentNode.save();
  }
}

module.exports = (socket) => {
  socket.on(listenerName, ({ name, description, nodeId }) => {
    console.log('name:', name, 'description:', description, 'nodeId:', nodeId);
    editPart(name, description, nodeId)
      .then()
      .catch((err) => {
        console.log(`[${listenerName}] error: ${err}`);
      });
  });
};
