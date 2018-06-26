const mongoose = require('mongoose');
const THREE = require('three');

const NestedNode = require('./nestedSchema/NestedNodeSchema');
const NestedUser = require('./nestedSchema/NestedUserSchema');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const NestedTeam = require('./nestedSchema/NestedTeamSchema');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');

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
  Workspaces: { type: [NestedWorkspace], require: true },

  // The system Information of the Node
  created: { type: Date, default: Date.now() },
  modified: { type: Date, default: Date.now() },
  maturity: { type: String, default: NodeTypeEnum.maturity[0] },
  activities: { type: [NestedComment], default: [] },

  // The
  tags: { type: [String], default: [] },
  children: { type: [NestedNode], default: [] },
  notes: { type: [NestedAnnotation], default: [] },

  team: { type: NestedTeam, required: true },
  owners: { type: [NestedUser], default: [] },
});

let Node = mongoose.model('Node', NodeSchema, 'Nodes');

module.exports = Node;
