const Node = require('../../models/Node');
const Part = require('../../models/Part');
const Assembly = require('../../models/Assembly');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');

/**
 * Get the content of a node
 * @param nodeId : {String}
 * @return {Promise<{content: *, type}>}
 */
async function getContentOfNode(nodeId) {
  try {
    const node = await Node.findById(nodeId);
    let content = null;
    if (!node) { throw Error(`[getContentNode] Unknown node: ${nodeId}`); }
    if (node.type === NodeTypeEnum.part) {
      content = await Part.findById(node.content);
    } else if (node.type === NodeTypeEnum.assembly) {
      content = await Assembly.findById(node.content);
    } else {
      throw Error('[getContentNode] Unknown type node');
    }
    return { content, type: node.type };
  } catch (err) {
    throw err;
  }
}

module.exports = getContentOfNode;
