let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
let User = require("./nestedSchema/NestedUserSchema");
let Workspace = require("./nestedSchema/NesttedWorkspaceSchema");

let Node = new mongoose.Schema({
    name: {type: String, required: true}
});

let OrganizationSchema = new mongoose.Schema({
    name: {type: String, required: true, index: { unique: true }},
    owner : {type: [User], required: true },
    members : [User],
    workspaces: [Workspace],
    // adresse : String
    node: [Node]
});

OrganizationSchema.plugin(uniqueValidator);

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;