let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
const autoPopulatePlugin = require('mongoose-autopopulate');
let Organization = require("./nestedSchema/NestedOrganizationSchema");
let User = require("./nestedSchema/NestedUserSchema");
let Node = require("./Node");
const NestedNode =  require("./nestedSchema/NestedNodeSchema")
const NestedTeam = require("./nestedSchema/NestedTeamSchema")

const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
let Stripe = new mongoose.Schema({
  name: String
});

/*
const Team = new mongoose.Schema({
  orga
})
*/

let WorkspaceSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: String,
  //nodeMaster: { type: mongoose., ref: 'Node' },
  node_master: { type: NestedNode },
  creation: { type: Date, default: new Date() },
  users: { type: [User], default: [] },
  team: { type: NestedTeam, required: true },
  organization: { type: Organization, required: true }, // /!\ WITHOUT END VARIABLE /!\
  Annotations: { type: [NestedAnnotation], required: true, default: [] },
});

WorkspaceSchema.plugin(autoPopulatePlugin);
/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => {
  return new Workspace(WorkspaceInformation);
}

let Workspace = mongoose.model("Workspace", WorkspaceSchema, "Workspaces");

module.exports = Workspace;
