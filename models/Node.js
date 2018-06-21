const mongoose = require('mongoose');
const util = require('util');
const rimraf = require('rimraf');
const Fsconfig = require('../config/FileSystemConfig');
const path = require('path');
const THREE = require('three');

const NestedNode = require('./nestedSchema/NestedNodeSchema');
const uniqueValidator = require('mongoose-unique-validator');
const NestedUser = require('./nestedSchema/NestedUserSchema');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const NestedTeam = require('./nestedSchema/NestedTeamSchema');
const PartSchema = require('./Part');
const AssemblySchema = require('./Assembly');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const asyncForEach = require('../utils/asyncForeach');
const log = require('../utils/log');

const NestedWorkspace = mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
  name: { type: String, require: true },
});

const NodeSchema = mongoose.Schema({
  // The core Information of the node
  name: { type: String, require: true },

  // TODO: Verificate the information
  description: String,

  // The content linked with the node
  type: { type: String, require: true },
  content: { type: mongoose.SchemaTypes.ObjectId, require: true },
  matrix: { type: [], default: new THREE.Matrix4() },
  Workspace: { type: mongoose.SchemaTypes.ObjectId, require: true },
  // The system Information of the Node
  created: { type: Date, default: Date.now() },
  modified: { type: Date, default: Date.now() },
  maturity: { type: String, default: NodeTypeEnum.maturity[0] },
  activities: { type: [NestedComment], default: [] },

  // The
  tags: { type: [String], default: [] },
  children: { type: [NestedNode], default: [] },
  notes: { type: [NestedAnnotation], default: [] },

  team: NestedTeam,
});

let Node = mongoose.model('Node', NodeSchema, 'Nodes');

module.exports = Node;


NodeSchema.plugin(uniqueValidator);

/**
 *
 * @param nodeInformation - The Object With all the information
 * @param nodeInformation.name - The name of the node (required)
 * @param nodeInformation.type - The type of the node (required)
 * @param nodeInformation.content - The content of the node(required)
 * @param nodeInformation.Workspaces - The Workspace of the node (required)
 * @param nodeInformation.ownerOrganization - The owner's organization of the node (required)
 * @param nodeInformation.description - The description of the node
 * @param nodeInformation.specFiles - The specFiles of the node
 * @param nodeInformation.tags - The tags of the node
 * @param nodeInformation.parent - The parent of the node
 * @param nodeInformation.children - The children of the node
 * @param nodeInformation.Users - The Users of the node
 * @param nodeInformation.owners - The owners of the node
 */
NodeSchema.statics.newDocument = (nodeInformation) => {
  if (!nodeInformation.name) { console.error(new Error('The Name of the Node is missing')); }

  if (!nodeInformation.type) { console.error(new Error('The Type of the Node is missing')); }

  if (!nodeInformation.content) { console.error(new Error('The Content of the Node is missing')); }

  return new Node(nodeInformation);
};

const deleteNode = util.promisify(rimraf);

async function deleteContent(id, type) {
  let content;
  if (type === NodeTypeEnum.part) {
    content = await PartSchema.findById(id).catch((err) => { throw err; });
  } else if (type === NodeTypeEnum.assembly) {
    content = await AssemblySchema.findById(id).catch((err) => { throw err; });
  } else throw new Error('The type of the node is not specified');

  if (!content) throw new Error('There is no content');

  await deleteNode(path.join(Fsconfig.appDirectory.files3D, content.path)).catch((err) => { throw err; });

  await content.remove();
}

async function findNodeByIdAndRemove(id) {
  const node = await Node.findById(id);

  const parentNodes = await Node.find({ 'children._id': id });

  function filterChildId({_id}) {
    return ! _id.equals(node._id);
  }

  for (let i = 0; i < parentNodes.length; i++) {
    const parentNode = parentNodes[i];
    parentNode.children = parentNode.children.filter(filterChildId);
    await parentNode.save().catch(err => { throw err });
  }

  if (!node) throw new Error('Node not Found');

  for (let i = 0; i < node.children.length; i++) {
    const child = await Node
      .findById(node.children[i]._id).catch((err) => { throw err; });
    await child
      .remove()
      .catch((err) => { throw err; });
  }
  return null;
}

NodeSchema.pre('remove', function (next) {
  const promises = [];

  promises.push(findNodeByIdAndRemove(this._id));
  promises.push(deleteContent(this.content, this.type));

  Promise.all(promises)
    .then(() => next())
    .catch(err => next(err));
});
