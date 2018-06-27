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
  AccessNode: [{
    Node: { type: Schema.Types.ObjectId, ref: 'Node' },
    assignements: [{
      User: { type: Schema.Types.ObjectId, ref: 'User' },
      //rights: null
    }]
  }],

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

/*
WorkspaceSchema.methods.hasUserAccess = async function (nodeId) {

}

WorkspaceSchema.methods.userAccessToNode = async function (nodeId) {
  
}

WorkspaceSchema.methods.addAnAccessToAUser = async function (nodeId, userId) {

}

WorkspaceSchema.methods.removeAn = async function (nodeId, userId) {

}

WorkspaceSchema.methods.removeAllAccess =  async function (userId) {

}
*/

/**
  * Returns if the user is the Product Manager or not
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  */
WorkspaceSchema.methods.isProductManager = function (userId) {
  const ProductManagers = this.populated('ProductManagers') || this.ProductManagers;
  const isManager = function (manager) {
    return manager.equals(userId);
  };
  return ProductManagers.some(isManager);
};

/**
  * Returns if the user is a Teammate or not
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  */
WorkspaceSchema.methods.isTeammate = function (userId) {
  const Teammates = this.populated('Teammates') || this.Teammates;
  const even = function (teammate) {
    const id = mongoose.Types.ObjectId(teammate);
    return id.equals(userId);
  };
  return Teammates.some(even);
};

/**
  * Returns if the user is an Observer or not
  * @param {mongoose.SchemaTypes.ObjectId} userId
  * @returns {Boolean}
  */
WorkspaceSchema.methods.isObserver = function (userId) {
  const Observers = this.populated('Observers') || this.Observers;
  const even = function (observer) {
    const id = mongoose.Types.ObjectId(Observers);
    return id.equals(userId);
  };
  return Observers.some(even);
};

/**
  * Returns the user 'level access' 
  * @param {mongoose.SchemaTypes.ObjectId} userId 
  * @returns {Number}
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
  let role = this.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const User = await userSchema.findById(userId);
  if (!User) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.checkOrganization(this.Organization);

  if (organizationAlreadyExist)
    await User.addWorkspace(this.Organization, this._id);
  else {
    await User.addOrganization(this.Organization);
    await User.addWorkspace(this.Organization, this._id);
  }

  this.ProductManagers.push(userId);
  await this.save();
};

WorkspaceSchema.methods.addTeammate = async function (userId) {
  let role = this.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const User = await userSchema.findById(userId);
  if (!User) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.checkOrganization(this.Organization);

  if (organizationAlreadyExist)
    await User.addWorkspace(this.Organization, this._id);
  else {
    await User.addOrganization(this.Organization);
    await User.addWorkspace(this.Organization, this._id);
  }

  this.Teammates.push(userId);
  await this.save();
};

// noinspection JSAnnotator
WorkspaceSchema.methods.changeRole = async function (userId, newRole) {
  try {
    const formerRole = this.hasRights(userId);
    if (!formerRole)
      throw new Error('Cannot find the user');

    if (formerRole === Number(newRole))
      throw new Error('[Organization] the new role is the same before the changement, skipping changement ...');

    function idNotEqual(_id) {
      return !_id.equals(userId);
    }

    switch (formerRole) {
      case 3:
        this.ProductManagers = this.ProductManagers.filter(idNotEqual);
        break;
      case 2:
        this.Teammates = this.Teammates.filter(idNotEqual);
        break;
      case 1:
        this.Observers = this.Observers.filter(idNotEqual);
        break;
      default:
        break;
    }

    switch (Number(newRole)) {
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
  } catch (e) {
    log.error(e);
    throw e;
  }
};

WorkspaceSchema.methods.addObserver = async function (userId) {
  throw new Error('Cannot create an observer');

  let role = this.hasRights(userId);
  if (role) throw new Error('[Workspace] - [Users] - Duplicate User !');

  const user = await userSchema.findById(userId);
  if (!user) throw new Error('[Workspace] - [User] - Cannot find the user.');

  let organizationAlreadyExist = User.checkOrganization(this.Organization);

  if (organizationAlreadyExist)
    await user.addWorkspace(this.Organization, this._id);
  else {
    await user.addOrganization(this.Organization);
    await user.addWorkspace(this.Organization, this._id);
  }

  this.Observers.push(userId);
  await this.save();
};

/**
 *
 * Remove one user from the Workspace
 * @param {*} userId the user ID to be deleted
 * @param {boolean} [cancelRequest=false] Make another request to delete the user's workspace
 */
WorkspaceSchema.methods.removeUser = async function (userId, cancelRequest = false) {
  const userRole = this.hasRights(userId);

  function filterId(id) {
    const isEqual = id.equals(userId);
    return !isEqual;
  }

  switch (userRole) {
    case 3:
      this.ProductManagers = this.ProductManagers.filter(filterId);
      break;
    case 2:
      this.Teammates = this.Teammates.filter(filterId);
      break;
    case 1:
      this.Observers = this.Observers.filter(filterId);
      break;
    default:
      throw new Error('The user does not exist');
      break;
  }

  if (!cancelRequest) {
    const user = await userSchema.findById(userId);
    if (!user) throw new Error('The user does not exist');
    await user.removeWorkspace(this.Organization, this._id);
  }

  await this.save();
};

/**
 * Remove multiples user from the database
 * @param {mongoose.Schema.ObjectId} usersId
 * @param {boolean} [cancelRequest=false]
 */

WorkspaceSchema.methods.removeUsers = async function (usersId, cancelRequest = false) {
  if (Array.isArray(usersId)) {
    for (let i = 0; i < usersId.length; i++) {
      await removeUser(usersId[i], cancelRequest);
    }
  } else await removeUser(usersId[i], cancelRequest);
};

WorkspaceSchema.pre('save', function (next) {
  if (this.isModified('name'))
    this.name = this.name.trim();
  if (this.isModified('description') && !(this.description == null || this.description == ""))
    this.description = this.description.trim();

  return next();
});

WorkspaceSchema.pre('remove', async function () {
  try {
    const _id = this._id;

    const Invitation = require('./Invitation');
    const invitations = Invitation.find({ "workspace.id": this._id }).cursor();

    for (let doc = await invitations.next(); doc !== null; doc = await cursor.next()) {
      await doc.remove().catch(err => log.error(err));
    }

    function filterWorkspace(id) {
      const isEqual = id.equals(_id);
      return !isEqual;
    }
    const organizationSchema = require('./Organization');
    const organization = await organizationSchema.findById(this.Organization);
    organization.Workspaces = organization.Workspaces.filter(filterWorkspace);
    await organization.save();

    //Delete the nodeMaster
    const nodeMaster = await nodeSchema.findById(this.nodeMaster);
    await nodeMaster.remove();

    //Delete the user inside the workspace
    const users = this.users;
    for (let i = 0; i < users.length; i++) {
      const userId = users[i];
      await this.removeUser(userId);
    }
    return null;
  } catch (err) {
    console.error(err);
    throw new Error(`[Workspace] - remove \n ${err}`);
  }
});


//TODO: REMOVE that
/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => new Workspace(WorkspaceInformation);

let Workspace = mongoose.model('Workspace', WorkspaceSchema, 'Workspaces');

module.exports = Workspace;
