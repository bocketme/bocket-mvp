const id = String(user);
const filter = String(owner._id);
return id !== filter;
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

/*
const Team = new mongoose.Schema({
  orga
})
*/

let WorkspaceSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: String,
  // nodeMaster: { type: mongoose., ref: 'Node' },
  node_master: { type: NestedNode },
  creation: { type: Date, default: new Date() },
  users: { type: [User], default: [] },
  team: { type: NestedTeam, required: true },
  organization: { type: Organization, required: true }, // /!\ WITHOUT END VARIABLE /!\
  Annotations: { type: [NestedAnnotation], required: true, default: [] },
  Tchats: { type: [NestedTchat], required: true, default: [] },
});

/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => new Workspace(WorkspaceInformation);

let Workspace = mongoose.model('Workspace', WorkspaceSchema, 'Workspaces');

module.exports = Workspace;
