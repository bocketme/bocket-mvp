const serverConfiguration = require("../config/server");
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const User = require("./nestedSchema/NestedUserSchema");
const Workspace = require("./nestedSchema/NestedWorkspaceSchema");
const config = require('../config/server');
const fs = require('fs');
const path = require('path');

let Node = new mongoose.Schema({
    name: { type: String, required: true }
});

let OrganizationSchema = new mongoose.Schema({
    name: {type: String, required: true, index: { unique: true }},
    owner : {type: [User], required: true },
    members : [User],
    workspaces: [Workspace],
    // adresse : String
    //TODO: Why? - L'organization a une liste de noeud ???
    node: [Node]
});

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;
