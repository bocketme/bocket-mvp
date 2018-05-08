const serverConfiguration = require("../config/server");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
  name: { type: String, required: true, index: { unique: true } },
  Owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  Admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Members: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  //The creation date of the workpsaces.
  creation: { type: Date, default: new Date() },  
  //TODO: Script to fill the workpsaces.
  //The list of workspaces of the organization
  Workspaces: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  //TODO: Delete workspace.
  //workspaces: [Workspace],
  //TODO: Fill the address facturation / Need form
  address: String,
  city: String,
  country: String,
  //TODO: Mise en place du Stripe
  node: [Node]  //TODO: Delete Safe (node is empty)
});

/**
 * Create a new Organization in the database
 * @param {Object} OrganizationInformation - The information of the organization
 */
OrganizationSchema.statics.newDocument = (OrganizationInformation) => {
  return new Organization(OrganizationInformation);
};

OrganizationSchema.pre('save', function (next) {
  let organizationPath = path.join(config.files3D, '/' + this.name + "-" + this._id);
  fs.access(organizationPath, (err) => {
    if (err) {
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
