let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

let Organization = require("./nestedSchema/NestedOrganizationSchema");
let User  = require("./nestedSchema/NestedUserSchema");

let Stripe = new mongoose.Schema({
    name: String
});

let Node = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true}
});

let WorkspaceSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    owner: {type: User, require: true},
    description: String,
    node_master: Node,
    creation: {type:Date, default: new Date()},
    organization: {type: Organization, required: true} // /!\ WITHOUT END VARIABLE /!\
});

let Workspace = mongoose.model("Workspace", WorkspaceSchema, "Workspaces");

module.exports = Workspace;