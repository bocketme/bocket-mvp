const serverConfiguration = require("../config/server");
const workspaceSchema = require('./Workspace')
const userSchema = require("./User");
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

/**
 * Create a new Organization in the database
 * @param {Object} OrganizationInformation - The information of the organization
 */
OrganizationSchema.statics.newDocument = (OrganizationInformation) => {
  return new Organization(OrganizationInformation);
};


OrganizationSchema.methods.removeUser = function (userId, isOwner) {
  return new Promise((resolve, reject) => {
    deletingUser(this, userId, isOwner)
      .then(() => next)
      .catch(err => next(err));
  });
}

async function deletingUser(userId, newOwner = null) {
  try {
    console.log('deleting a user ...');
    const filter = String(userId);
    const Owner = doc.get('Owner');
    let ownerId = String(Owner);
    if (ownerId === filter) {
      if (newOwner)
        doc.Owner = newOwner;
      else
        throw new Error('The new Owner is not set');
    }

    const Admins = doc.get('Admins');
    doc.Admins = Admins.filter(adminId => {
      const id = String(adminId);
      return id === filter;
    });

    const Members = doc.get('Members');
    doc.Members = Members.filter(member => {
      const id = String(member);
      return id === filter;
    });

    const workpsaces = doc.get('Workspaces');

    for (let i = 0; i < workpsaces.length; i++) {
      const workspace = await workspaceSchema.findById(workpsaces[i]);
      await workspace.removeUser(userId);
    }

    const user = await userSchema(userId);
    await user.removeOrganization(doc._id);
    await doc.save();
    return 0;
  } catch (e) {

  }
};

OrganizationSchema.virtual('users').get(function () {
  return [this.Owner, ...this.Admins, ...this.Members]
});


OrganizationSchema.methods.addAdmin = async function (userId) {
  this.Admins.push(userId);
  await this.save();
};

OrganizationSchema.methods.deleteAdmin = async function (userId) {
  this.Admins = this.Admins.filter(function (admin) {
    const isEqual = admin.equals(userId);
    return !isEqual;
  });
  await this.save();
};

OrganizationSchema.methods.addMember = async function (userId) {
  this.Members.push(userId);
  await this.save();
};

OrganizationSchema.methods.deleteMember = async function (userId) {
  this.Members = this.Members.filter(function (member) {
    const isEqual = member.equals(userId);
    return !isEqual;
  });
  await this.save();
};

OrganizationSchema.methods.changeOwner = async function (userId) {
  const role = this.userRights(userId);

  switch (role) {
    case 4:
      this.deleteMember(userId);
      break;
    case 5:
      this.deleteAdmin(userId);
      break;
    default:
      throw new Error('Cannot change the user, it has no rights inside the organization or he is already the owner, role = ', role)
      break;
  }

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
  const even = function (admin) {
    return admin.equals(userId)
  };
  return Admins.some(even);
};
/**
 * Returns whether the user has the rights or not
 * @param {any} userId 
 * @returns 
 */
OrganizationSchema.methods.isMember = function (userId) {
  const Members = this.populated('Members') || this.Members;
  const even = function (member) {
    return member.equals(userId);
  }
  return Members.some(even);
};

/**
 * Returns which rights the user has 
 * @param {any} userId 
 * @returns 
 */
OrganizationSchema.methods.userRights = function (userId) {
  if (this.isOwner(userId)) return 6;
  else if (this.isAdmin(userId)) return 5;
  else if (this.isMember(userId)) return 4;
  else return null;
}

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

OrganizationSchema.pre('remove', async function (next) {
  try {
    const organization = OrganizationSchema.findById(this._id)
    for (let i = 0; i < this.Admins.length; i++) {
      const admin = this.Admins[i];
      await organization.removeUser(admin);
    }

    for (let i = 0; i < this.Members.length; i++) {
      const member = this.Members[i];
      await organization.removeUser(member);
    }

    for (let i = 0; i < this.Workspaces.length; i++) {
      const workspaceId = this.Workspaces[i];
      const workspace = await workspaceSchema.findById(workspaceId);
      await workspace.remove();
    }
    next();
  } catch (err) {
    next(err);
  }
});

OrganizationSchema.plugin(uniqueValidator);

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;
