const serverConfiguration = require("../config/server");
const workspaceSchema = require('./Workspace')
const userSchema = require("./User");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const log = require('../utils/log');
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

  avatar: String,
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


OrganizationSchema.virtual('users').get(function () {
  return [this.Owner, ...this.Admins, ...this.Members];
});


//LIST OF VIRTUAL CONSTANT
OrganizationSchema.virtual('MEMBER').get(() => 4);
OrganizationSchema.virtual('ADMIN').get(() => 5);
OrganizationSchema.virtual('OWNER').get(() => 6);

/**
 * Create a new Organization in the database
 * @param {Object} OrganizationInformation - The information of the organization
 */
OrganizationSchema.statics.newDocument = (OrganizationInformation) => {
  return new Organization(OrganizationInformation);
};

OrganizationSchema.virtual('users').get(function () {
  return [this.Owner, ...this.Admins, ...this.Members]
});


OrganizationSchema.methods.addAdmin = async function (userId) {
  try {
    const rights = this.userRights(userId)
    if (rights) throw new Error('[User] - The user is already existing');
    const user = await userSchema.findById(userId);
    if (!user) throw new Error('[User] - Cannot find the user')

    await user.addOrganization(this._id);

    this.Admins.push(userId);

    await this.save();
  } catch (e) {
    log.error(e);
    throw new Error('[Organization] - Add admin - Cannot add the new Admin');
  }
};

OrganizationSchema.methods.deleteAdmin = async function (userId) {
  try {
    const hasRights = this.isAdmin(userId) || this.isOwner(userId);
    if (!hasRights) throw new Error('[User] - The user has not the necessary rights');

    const user = await userSchema.findById(userId);
    if (!user) throw new Error('[User] - Cannot find the user');
    await user.removeOrganization(this._id);

    function filterAdmin(admin) {
      const isEqual = admin.equals(userId);
      return !isEqual;
    }
    this.Admins = this.Admins.filter(filter);

    await this.save();
  } catch (e) {
    log.error(e);
    throw new Error('[Organization] - Delete Admin - Cannot remove the admin.')
  }
};

OrganizationSchema.methods.addMember = async function (userId) {
  try {
    const rights = this.userRights(userId)
    if (rights) throw new Error('[User] - The user is already existing');
    const user = await userSchema.findById(userId);
    if (!user) throw new Error('[User] - Cannot find the user')

    await user.addOrganization(this._id);

    this.Members.push(userId);

    await this.save();
  } catch (e) {
    log.error(e);
    throw new Error('[Organization] - Add Member - Cannot add a new member');
  }
};

OrganizationSchema.methods.deleteMember = async function (userId) {
  try {
    const rights = this.isMember(userId)
    if (!rights) throw new Error('[User] - The user is not a member');
    const user = await userSchema.findById(userId);
    if (!user) throw new Error('[User] - Cannot find the user');
    await user.removeOrganization(this._id);

    function filterMember(_id) {
      const isEqual = _id.equals(userId);
      return !isEqual;
    }

    this.Members = this.Members.filter(filterMember);

    await this.save();
  } catch (e) {
    log.error(e);
    throw new Error('[Organization] - delete Member - cannot remove a member')
  }
};

OrganizationSchema.methods.changeRole = async function (userId, newRole) {
  const formerRole = this.userRights(userId);
  switch (formerRole) {
    case this.OWNER:
      throw Error('Cannot change the role of the owner');
      break;
    case this.ADMIN:
      this.Admins = this.Admins.filter(_id => !_id.equals(userId));
      break;
    case this.MEMBER:
      this.Members = this.Members.filter(_id => !_id.equals(userId));
      break;

    default:
      throw Error('The use has no rights');
      break;
  }

  switch (Number(newRole)) {
    case this.MEMBER:
      this.Members.push(userId);
      log.info('User added to Members')
      break;
    case this.ADMIN:
      this.Admins.push(userId);
      log.info('User added to Admins')
      break;
    default:
      throw new Error(`Role not defined or not usable , role =  ${role}`);
      break;
  }

  await this.save();
  return this;
}

OrganizationSchema.methods.transfertOwnership = async function (userId) {
  const role = this.userRights(userId);

  switch (role) {
    case 4:
      this.Members = this.Members.filter(_id => !_id.equals(userId));
      break;
    case 5:
      this.Admins = this.Admins.filter(_id => !_id.equals(userId))
      break;
    default:
      throw new Error(`Cannot change the user, it has no rights inside the organization or he is already the owner, ${role}`)
      break;
  }

  this.Admins.push(this.Owner);

  this.Owner = userId;
  await this.save();
};

OrganizationSchema.methods.changeOwner = async function (userId) {
  const role = this.userRights(userId);

  switch (role) {
    case 4:
      this.Members = this.Members.filter(_id => !_id.equals(userId));
      break;
    case 5:
      this.Admins = this.Admins.filter(_id => !_id.equals(userId))
      break;
    default:
      throw new Error(`Cannot change the user, it has no rights inside the organization or he is already the owner, ${role}`)
      break;
  }

  const vaccantOwner = await userSchema.findById(this.Owner);
  vaccantOwner.removeOrganization(this._id);

  this.Owner = userId;
  await this.save();
};



/**
 * Returns whether the user has the rights or not
 * @param {any} userId 
 * @returns {Boolean} rights
 */
OrganizationSchema.methods.isOwner = function (userId) {
  const Owner = this.populated('Owner') || this.Owner
  return Owner.equals(userId);
};
/**
 * Returns whether the user has the rights or not
 * @param {any} userId 
 * @returns 
 */
OrganizationSchema.methods.isAdmin = function (userId) {
  const Admins = this.populated('Admins') || this.Admins;
  const even = (id) => id.equals(userId);
  return Admins.some(even);
};
/**
 * Returns whether the user has the rights or not
 * @param {any} userId 
 * @returns 
 */
OrganizationSchema.methods.isMember = function (userId) {
  const Members = this.populated('Members') || this.Members;
  const even = (id) => id.equals(userId);
  return Members.some(even);
};

/**
 * Returns which rights the user has 
 * @param {any} userId 
 * @returns 
 */
OrganizationSchema.methods.userRights = function (userId) {
  if (this.isOwner(userId)) return this.OWNER;
  else if (this.isAdmin(userId)) return this.ADMIN;
  else if (this.isMember(userId)) return this.MEMBER;
  else return null;
}

OrganizationSchema.pre('save', function (next) {
  const id = String(this._id);
  this.name = this.name.trim();
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

OrganizationSchema.pre('remove', async function () {
  try {
    for (let i = 0; i < this.Workspaces.length; i++) {
      const workspaceId = this.Workspaces[i];
      const workspace = await workspaceSchema.findById(workspaceId);
      await workspace.remove();
    }
    
    const Owner = await userSchema.findById(this.Owner).catch();
    if (Owner)
      await Owner.removeOrganization(this._id);

    for (let i = 0; i < this.Admins.length; i++) {
      const admin = this.Admins[i];
      await this.deleteAdmin(admin);
    }

    for (let i = 0; i < this.Members.length; i++) {
      const member = this.Members[i];
      await this.deleteMember(member);
    }
    return null;
  } catch (err) {
    throw new Error(`[Organization] - Remove Cannot remove the workspace \n ${err}`);
  }
});

OrganizationSchema.plugin(uniqueValidator);

const Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;
