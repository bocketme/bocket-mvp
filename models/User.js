const serverConfiguration = require('../config/server');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const util = require('util');
const log = require('../utils/log');
const compare = util.promisify(bcrypt.compare);

const ManagerSchema = new mongoose.Schema({
  Organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },
  Workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
});

const UserSchema = new mongoose.Schema({
  completeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: Boolean,
  createDate: { type: Date, default: new Date() },

  avatar: String,

  //TODO: Script to fill the OrganizationManager
  Manager: [ManagerSchema],
  //workspaces: { type: [NestedWorkspaceSchema] },
  //organizations: { type: [NestedOrganizationSchema] }, //TODO: Deletion Sage (empty var).

  //TODO: Create a forget password context.
  forget: {
    active: { type: Boolean, default: false },
    key: String
  },
  options: {
    celShading: { type: Boolean, default: false },
    unit: { type: String, default: 'cm' },
    colorBackground: { type: String, default: "#e0e0e0" },
  }
});

UserSchema.methods.organizationOwner = async function () {
  const organizationSchema = require('./Organization');
  const owner = [];
  for (let i = 0; i < this.Manager.length; i++) {
    const manager = this.Manager[i];
    const organization = await organizationSchema.findById(manager.Organization);
    if (organization.isOwner(this._id)) owner.push(organization._id);
  }
  return owner
};

UserSchema.pre('save', function (next) {
  const user = this;

  user.active = true;
  if (!user.createDate) { user.createDate = new Date(); }
  // only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    // generate a salt
    bcrypt.genSalt(serverConfiguration.saltRounds, (err, salt) => {
      if (err) return next(err);
      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // override the cleartext password with the hashed one
        user.password = hash;
        return next();
      });
    });
  } else return next();
});

UserSchema.pre('remove', async function () {
  try {
    const organizationSchema = require('./Organization');
    const workspaceSchema = require('./Workspace');
    for (let i = 0; i < this.Manager.length; i++) {
      const manager = this.Manager[i];

      const organization = await organizationSchema.findById(manager.Organization);
      let hasRights = organization.userRights(this._id);
      if (!hasRights)
        throw new Error('[UserSchema - Remove] - The user has no rights inside the organization');
      else if (hasRights === organization.OWNER)
        await organization.remove();
      else {
        if (hasRights === organization.ADMIN)
          await organization.deleteAdmin(this._id);
        else if (hasRights === organization.MEMBER)
          await organization.deleteMember(this._id);
        else throw new Error('The user has no rights inside the organization');
      }
    }
    return null;
  } catch (e) {
    throw new Error(`[UserSchema - Remove] - Cannot remove the user \n ${e}`);
  }
});

/**
 * 
 * Checks if the user has rights in an organization.
 * @param {mongoose.Types.ObjectId} organizationId
 * @returns {Boolean}
 */
UserSchema.methods.checkOrganization = function (organizationId) {
  function userHasRights(manager) {
    return manager.Organization.equals(organizationId);
  }
  return this.Manager.some(userHasRights);
};

/**
 * Returns the index organization in which the user is located, or otherwise returns nothing.
 * @param {mongoose.Types.ObjectId} organizationId 
 */
UserSchema.methods.findIndexOrganization = function (organizationId) {
  function userOrganization({ Organization }) {
    return !!Organization.equals(organizationId);
  }
  return this.Manager.findIndex(userOrganization);
};

/**
 * Checks if the user has rights in a workspace. 
 * @param {mongoose.Types.ObjectId} workspaceId
 */
UserSchema.methods.checkWorkspace = function (workspaceId) {
  function userHasRights(manager) {
    for (let i = 0; i < manager.Workspaces.length; i++) {
      const workspace = manager.Workspaces[i];
      if (workspace.equals(workspaceId)) return true;
    }
    return false;
  }
  return this.Manager.some(userHasRights);
};

/**
 * Returns the user with the new organization. If the organization exists, returns an error.
 * @param {any} organizationId 
 * @returns  {Promise} Promise to add an organization in the UserManager and save It.
 */
UserSchema.methods.addOrganization = async function (organizationId) {
  const isExisting = this.checkOrganization(organizationId);
  if (isExisting) throw new Error("[Database] - [User] - [Magnager] - Cannot add an organization that already exists");
  else this.Manager.push({ Organization: organizationId });
  await this.save();
  return this;
};

/**
 * Returns the user without the organization. If the organization does not exist, returns an error.
 * @param {mongoose.Types.ObjectId} organizationId
 */
UserSchema.methods.removeOrganization = async function (organizationId) {
  const isExisting = this.checkOrganization(organizationId);
  const workspaceSchema = require('./Workspace');

  if (!isExisting) throw new Error("[Database] - [User] - [Magnager] - Cannot delete an organization that does not exists");
  else {
    function findWorkspace({ Organization }) {
      return Organization.equals(organizationId);
    }
    const { Workspaces } = this.Manager.find(findWorkspace);

    const workspaceCursor = workspaceSchema
      .find({ _id: { $in: Workspaces } }).cursor();

    const next = workspaceCursor.next;

    for (workspace = await next(); workspace !== null; workspace = await next()) {
      await workspace.removeUser(this._id, true);
    }

    function filterOrganization({ Organization }) {
      return !Organization.equals(organizationId);
    }

    this.Manager = this.Manager.filter(filterOrganization);
  }
  await this.save();
  return this;
};

UserSchema.methods.addWorkspace = async function (organizationId, workspaceId) {
  if (!organizationId || !workspaceId)
    throw new Error("[Database] - [User] - [Manager] - Cannot add a workspace without an organizationId or workspaceId");

  const index = this.findIndexOrganization(organizationId);

  if (index === -1) {
    await this.addOrganization(organizationId);
    this.Manager[this.Manager.length - 1].Workspaces.push(workspaceId);
  }
  else
    this.Manager[index].Workspaces.push(workspaceId);

  await this.save();
  return this;
};

/**
 * Find the organization and delete its workspace from the user manager.
 * @param {mongoose.Types.ObjectId} [organizationId=null] 
 * @param {mongoose.Types.ObjectId} [workspaceId=null] 
 * @returns {UserSchema} User Document
 */
UserSchema.methods.removeWorkspace = async function (organizationId, workspaceId) {
  if (!organizationId || !workspaceId) ("[Database] - [User] - [Manager] - Cannot delete a workspace without an organizationId or workspaceId");

  const index = this.findIndexOrganization(organizationId);

  if (index === -1)
    throw new Error("[Database] - [User] - [Manager] - Cannot find the organization");
  else {
    function isNotEqual(id) {
      const isEqual = id.equals(workspaceId);
      return !isEqual;
    }
    this.Manager[index].Workspaces = this.Manager[index].Workspaces.filter(isNotEqual);
  }
  this.save();
  return this;
};

UserSchema.methods.fetchAllWorkspaces = function () {
  let workspaces = [];
  for (let i = 0; i < this.Manager.length; i++) {
    const { Workspaces } = this.Manager[i];
    workspaces = [...workspaces, ...Workspaces];
  }
  return workspaces;
};

UserSchema.methods.fetchAllWorkspacesByOrgaId = function (organizationId) {
  for (let i = 0; i < this.Manager.length; i++) {
    const { Organization, Workspaces } = this.Manager[i];
    if (Organization.equals(organizationId)) return Workspaces;
  }
  return null;
};

//Replace comparePassword by authentification
UserSchema.methods.authentification = async function (candidatePassword) {
  if (candidatePassword === null) { throw Error('need candidatePassword'); }
  else {
    return await compare(candidatePassword, this.password);
  }
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (candidatePassword === null) { throw Error('need candidatePassword'); }
  else {
    return await compare(candidatePassword, this.password);
  }
};

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema, 'Users');

/**
 *
 *
 * @param {Object} UserInformation
 */
UserSchema.statics.newDocument = UserInformation => new User(UserInformation);


module.exports = User;
