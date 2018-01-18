const serverConfiguration = require("../config/server");
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const User = require("./nestedSchema/NestedUserSchema");
const Workspace = require("./nestedSchema/NesttedWorkspaceSchema");
const config = require('../config/server');
const fs = require('fs');
const path = require('path');

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


/**
 * Create a new Organization in the database
 * @param {Object} OrganizationInformation - The information of the organization
 */
OrganizationSchema.statics.newDocument = (OrganizationInformation) => {
    return new Organization(OrganizationInformation);
}

OrganizationSchema.pre('save', function (next) {
    let organizationPath = path.join(config.files3D, '/' + this.name);
    fs.access(organizationPath, (err) => {
        if (err){
            fs.mkdir(path.join(organizationPath), (err) => {
                if (err)
                    return next(err);
                return next();
            })
        } else
            return next();
    });
});
OrganizationSchema.plugin(uniqueValidator);

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;