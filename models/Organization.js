const serverConfiguration = require("../config/server");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
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
  Workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
  //TODO: Delete workspace.
  //workspaces: [Workspace],
  //TODO: Fill the address facturation / Need form
  address: String,
  city: String,
  country: String,
  //TODO: Mise en place du Stripe
  //Done delete node list.
});

/**
 * Create a new Organization in the database
 * @param {Object} OrganizationInformation - The information of the organization
 */
OrganizationSchema.statics.newDocument = (OrganizationInformation) => {
  return new Organization(OrganizationInformation);
};

const userSchema = require("./User");
const workspaceSchema = require('./Workspace');

OrganizationSchema.methods.removeUser = async function (userId, newOwner = null) {
  try {
    const filter = String(userId);
    const Owner = this.get('Owner');
    let ownerId = String(Owner);
    if (ownerId === filter) {
      if(newOwner)
        this.Owner = newOwner;
      else
        throw new Error('The new Owner is not set');
    }

    const Admins = this.get('Admins');
    this.Admins =  Admins.filter(adminId => {
      const id = String(adminId);
      return id === filter;
    });

    const Members =  this.get('Members');
    this.Members = Members.filter(member => {
      const id = String(member);
      return id === filter;
    });

    const workpsaces = this.get('Workspaces');

    for (let i = 0; i<workpsaces.length; i++) {
      const workspace = await workspaceSchema.findById(workpsaces[i]);
      await workspace.removeUser(userId);
    }

    const user = await userSchema(userId);
    await user.removeOrganization(this._id);
    await this.save();
    return 0;
  } catch (e) {

  }
};

OrganizationSchema.virtual('users').get(function() {
  return [this.Owner, ...this.Admins, ...this.Members]
});

OrganizationSchema.methods.findUserRights = function(userId) {
  const id = mongoose.Types.ObjectId(userId);
  if(this.Owner.equals(id))return 6;
  for(let i=0;i<this.Admins.length;i++){
    if(this.Admins[i].equals(id)) return 5
  }
  for(let i=0;i<this.Members.length;i++){
    if(this.Members[i].equals(id)) return 5
  }
  return null
};

OrganizationSchema.pre('save', function (next) {
  const id = String(this._id);
  let organizationPath = path.join(config.files3D, id);
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
