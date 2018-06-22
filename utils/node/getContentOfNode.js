const Node = require('../../models/Node');
const Part = require('../../models/Part');
const Assembly = require('../../models/Assembly');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');

/**
 * Get the content of a node
 * @param {String} nodeId : Node
 * @param {String} workspaceId : (Optional) The current workspace
 * @return {Promise<{content: *, type}>}
 */
async function getContentOfNode(nodeId, workspaceId = null) {
  const node = await Node.findById(nodeId).catch(err => {throw err});

  let content = null;

  if (!node) { throw Error(`[getContentNode] Unknown node: ${nodeId}`); }

  if (node.type === NodeTypeEnum.part)
    content = await Part.findById(node.content);
  else if (node.type === NodeTypeEnum.assembly)
    content = await Assembly.findById(node.content);
  else
    throw Error('[getContentNode] Unknown type node');

  if (!content) { throw Error(`[getContentNode] Unknown content: ${node.content}`); }

  return { content, type: node.type, node };
}

module.exports = getContentOfNode;
