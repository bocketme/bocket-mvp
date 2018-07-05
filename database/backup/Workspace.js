const mongoose = require('mongoose');
const NestedTchat = require('./nestedSchema/NestedTchat');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const User = require('./nestedSchema/NestedUserSchema');

const { Schema } = mongoose;

let Stripe = new mongoose.Schema({
  name: String
});

let WorkspaceSchema = new mongoose.Schema({
  //General Information
  name: { type: String, require: true },
  description: String,

  Annotations: { type: [NestedAnnotation], required: true, default: [] },
  Tchats: { type: [NestedTchat], required: true, default: [] },

  //Node Master of the product
  nodeMaster: { type: Schema.Types.ObjectId, ref: 'Node' },

  users: { type: [User], default: [] },

  //Team
  ProductManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Teammates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Observers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  //Organization who own the workspace
  Organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },

  //Creation
  creation: { type: Date, default: Date.now() },

  avatar: String,
  //Annotation
  Annotations: { type: [NestedAnnotation], required: true, default: [] }
});

let Workspace = mongoose.model('Workspace', WorkspaceSchema, 'Workspaces');

module.exports = Workspace;
