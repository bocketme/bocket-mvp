let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

let Organization = require("./nestedSchema/NestedOrganizationSchema");
let User  = require("./nestedSchema/NestedUserSchema");
let NestedNode = require("./nestedSchema/NestedNodeSchema");
let Node = require("./Node");

let Stripe = new mongoose.Schema({
    name: String
});

let WorkspaceSchema = new mongoose.Schema({
    name: { type: String, require: true },
    owner: {type: User, require: true},
    description: String,
    node_master: { type: NestedNode },
    creation: { type:Date, default: new Date() },
    users: {type: [User], required: false, default: []},
    organization: {type: Organization, required: true} // /!\ WITHOUT END VARIABLE /!\
});

let Workspace = mongoose.model("Workspace", WorkspaceSchema, "Workspaces");

module.exports = Workspace;