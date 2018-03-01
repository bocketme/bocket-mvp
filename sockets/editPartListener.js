const listenerName = 'editPart';
const Node = require('../models/Node');
const getContentOfNode = require('../utils/node/getContentOfNode');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const actionSucceeded = require('./emitter/actionSucceeded');
const actionFailed = require('./emitter/actionFailed');

async function editPart(newName, newDescription, nodeId) {
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

    await node.save();
    await content.save();
    await parentNode.save();
  }
}

module.exports = (socket) => {
  socket.on(listenerName, ({ name, description, nodeId }) => {
    console.log('name:', name, 'description:', description, 'nodeId:', nodeId);
    editPart(name, description, nodeId, socket.handshake.session.currentWorkspace)
      .then(() => {
        actionSucceeded(socket, { title: 'Edit Part', description: 'Succeeded' });
        socket.emit(listenerName, { nodeId, newName: name })
      })
      .catch((err) => {
        actionFailed(socket, { title: 'Edit Part', description: 'Internal Server Error, please retry' });
        console.log(`[${listenerName}] error: ${err}`);
      });
  });
};
