const serverConfiguration = require('../config/server');
const mongoose = require('mongoose');

const NestedTchat = require('./nestedSchema/NestedTchat');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const userSchema = require('./User');
const nodeSchema = require('./Node');
const { Schema } = mongoose;

let WorkspaceSchema = new mongoose.Schema({
  //General Information
  name: { type: String, require: true },
  description: String,

  Annotations: { type: [NestedAnnotation], required: true, default: [] },
  Tchats: { type: [NestedTchat], required: true, default: [] },

  //Node Master of the product
  nodeMaster: { type: Schema.Types.ObjectId, ref: 'Node' },

  //Team
  ProductManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Teammates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Observers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  //Organization who own the workspace
  Organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },

  //Creation
  creation: { type: Date, default: new Date() },

  avatar: String,
  //Annotation
  Annotations: { type: [NestedAnnotation], required: true, default: [] }
});

// TODO: DELETE ALL users attribute (workspace.users)

WorkspaceSchema.virtual('users').get(function () {
  return [...this.ProductManagers, ...this.Teammates, ...this.Observers];
});

/**
  * Returns if the user is the Product Manager or not
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  */
WorkspaceSchema.methods.isProductManager = function (userId) {
  const ProductManagers = this.populated('ProductManagers') || this.ProductManagers;
  const isManager = function (manager) {
    return manager.equals(userId);
  }
  console.log(ProductManagers)
  return ProductManagers.some(isManager);
}

/**
  * Returns if the user is a Teammate or not
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  */
WorkspaceSchema.methods.isTeammate = function (userId) {
  const Teammates = this.populated('Teammates') || this.Teammates;
  const even = function (teammate) {
    return teammate.isEqual(userId);
  }
  return Teammates.some(even);
}

/**
  * Returns if the user is an Observer or not
  * @param {mongoose.SchemaTypes.ObjectId} userId
  * @returns {Boolean}
  */
WorkspaceSchema.methods.isObserver = function (userId) {
  const Observers = this.populated('Observers') || this.Observers;
  const even = function (observer) {
    return observer.isEqual(userId);
  }
  return Observers.some(even);
}

/**
  * Returns the user 'level access' 
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  * @returns {number}
  */
WorkspaceSchema.methods.hasRights = function (userId) {
  if (this.isProductManager(userId)) return 3;
  else if (this.isTeammate(userId)) return 2;
  else if (this.isObserver(userId)) return 1;
  else return undefined;
};


/**
 * Create a new Product Manager
 * @param {mongoose.SchemaTypes.ObjectId} userId 
 * @returns {Promise<WorkspaceSchema>}
 */
WorkspaceSchema.methods.addProductManager = async function (userId) {
  let role = this.authorization.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const User = await userSchema.findById(userId);
  if (!user) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.authorization.organization
    .check(this.Organization);

  if (organizationAlreadyExist)
    await User.administrate.workspace.add(this.Organization, this._id);
  else {
    await User.administrate.organization.add(this.Organization);
    await User.administrate.workspace.add(this.Organization, this._id);
  }

  this.ProductManagers.push(userId);
  await this.save();
};

WorkspaceSchema.methods.addTeammate = async function (userId) {
  let role = this.authorization.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const User = await userSchema.findById(userId);
  if (!user) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.authorization.organization
    .check(this.Organization);

  if (organizationAlreadyExist)
    await User.administrate.workspace.add(this.Organization, this._id);
  else {
    await User.administrate.organization.add(this.Organization);
    await User.administrate.workspace.add(this.Organization, this._id);
  }

  this.Teammates.push(userId);
  await this.save();
}

WorkspaceSchema.methods.changeRole = async function (userId, newRole) {
  await this.removeUser(userId);

  switch (newRole) {
    case 3:
      this.ProductManagers.push(userId);
      break;
    case 2:
      this.Teammates.push(userId);
      break;
    case 1:
      //TODO: Delete the throw Error
      throw new Error('Cannot Use An Observer');
      //this.Observers.push(userId);
      break;
    default:
      throw new Error('The value of role is not defined');
      break;
  }
  await this.save();
  return this;

}

WorkspaceSchema.methods.addObserver = async function (userId) {
  let role = this.authorization.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const User = await userSchema.findById(userId);
  if (!user) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.authorization.organization
    .check(this.Organization);

  if (organizationAlreadyExist)
    await User.administrate.workspace.add(this.Organization, this._id);
  else {
    await User.administrate.organization.add(this.Organization);
    await User.administrate.workspace.add(this.Organization, this._id);
  }

  this.Observers.push(userId);
  await this.save();
}

WorkspaceSchema.methods.removeUser = async function (userId) {
  const filter = String(userId);

  const User = await userSchema.findById(userId);
  if (!User) throw new Error('The user does not exist');

  let role = this.authorization.hasRights(userId);

  switch (role) {
    case 3:
      this.ProductManagers = this.ProductManagers.filter(Managers => {
        const id = String(Managers);
        return id !== filter;
      });
      break;
    case 2:
      this.Teammates = this.Teammates.filter(Teammate => {
        const id = String(Teammate);
        return id !== filter;
      });
      break;
    case 1:
      this.Observers = this.Observers.filter(Observer => {
        const id = String(Observer);
        return id !== filter;
      });
      break;
    default:
      throw new Error('The user has no right in this workspace');
      break;
  }

  await User.administrate.workspace.remove(this.Organization, this._id);
  await this.save();
};

WorkspaceSchema.pre('remove', async function () {
  //Delete the user inside the workspace
  const users = this.users;

  for (let i = 0; i < users.length; i++) {
    const userId = users[i];
    const user = await userSchema.findById(userId);

    await user.removeWorkspace(this._id);
    await user.save();
  }

  //Delete the nodeMaster
  const nodeMaster = await nodeSchema.findById(this.nodeMaster);
  nodeMaster.remove();

});

/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => new Workspace(WorkspaceInformation);

let Workspace = mongoose.model('Workspace', WorkspaceSchema, 'Workspaces');

module.exports = Workspace;
