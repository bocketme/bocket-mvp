let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");


let Stripe = new mongoose.Schema({
    name: String
});

let Node = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true}
});

let organization= new mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    name: {type: String, required: true}
});

let WorkspaceSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    description: String,
    node_master: Node,
    creation: {type:Date, default: new Date()},
    organization: {type: Organization, required: true}
});

let Workspace = mongoose.model("Workspace", WorkspaceSchema, "Workspaces");

module.exports = Workspace;