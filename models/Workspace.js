const serverConfiguration = require('../config/server');
const mongoose = require('mongoose');

const Organization = require('./nestedSchema/NestedOrganizationSchema');
const User = require('./nestedSchema/NestedUserSchema');
const NestedNode = require('./nestedSchema/NestedNodeSchema');
const NestedTeam = require('./nestedSchema/NestedTeamSchema');
const NestedTchat = require('./nestedSchema/NestedTchat');
const Node = require('./Node');

const NestedAnnotation = require('./nestedSchema/NestedAnnotation');

const Stripe = new mongoose.Schema({
  name: String,
});

let WorkspaceSchema = new mongoose.Schema({
  name: { type: String, require: true },
  owner: { type: User, require: true },
  description: String,
  node_master: { type: NestedNode },
  creation: { type: Date, default: new Date() },
  users: { type: [User], required: false, default: [] },
  team: { type: NestedTeam, required: true },
  organization: { type: Organization, required: true }, // /!\ WITHOUT END VARIABLE /!\
  Annotations: { type: [NestedAnnotation], required: true, default: [] },
  Tchats: { type: [NestedTchat], required: true, default: [] },
});

// TODO: DELETE ALL users attribute (workspace.users)

/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => new Workspace(WorkspaceInformation);

let Workspace = mongoose.model('Workspace', WorkspaceSchema, 'Workspaces');

module.exports = Workspace;
