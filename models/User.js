const serverConfiguration = require('../config/server');
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const bcrypt = require('bcrypt');
const organizationSchema = require('./Organization');
const uniqueValidator = require('mongoose-unique-validator');
const util = require('util');

const compare = util.promisify(bcrypt.compare);

const UserSchema = new mongoose.Schema({
  completeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: Boolean,
  createDate: {type: Date, default: new Date()},

  avatar: String,

  //TODO: Script to fill the OrganizationManager
  Organization: [{
    _id: {type: Schema.Types.ObjectId, required: true, ref: 'Organization'},
    workspaces: [{type: Schema.Types.ObjectId, ref: 'Workspace'}],
  }],
  //TODO: Delete all the workspaces + organizations
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

UserSchema.pre('save', function (next) {
  const user = this;

  user.active = true;
  if (!user.createDate) { user.createDate = new Date(); }
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(serverConfiguration.saltRounds, (err, salt) => {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('remove', async function(next) {
  try {
    const user = this;

    const ownerOrganization = await organizationSchema.find({'Owner': user._id});
  
    for (let i = 0; i < ownerOrganization.length; i++) {
      const organization = ownerOrganization[i];
      await organization.remove();
    }
  
  } catch(e) {
    console.error(e);
  }

  return next();
});

UserSchema.methods.removeOrganization = async function(organizationId) {
  const organizationManager = this.get('Organization');
  const filter = String(organizationId);
  this.Organization = organizationManager.filter(manager => {
    const _id = String(manager._id);
    return _id !== filter;
  });
};

UserSchema.methods.removeWorkspace = async function(workspaceId) {
  const organizationManager = this.get('Organization');
  const filter = String(workspaceId);

  this.Organization = organizationManager.map(manager => {
    manager.workspaces.filter(workspace => {
      const id = String(workspace);
      return id !== filter;
    });
    return manager;
  });
  await this.save();
};

UserSchema.methods.comparePassword = async function(candidatePassword)  {
  if (candidatePassword === null) { throw Error('need candidatePassword'); }
  else {
    const b = await compare(candidatePassword, this.password);
    return b;
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
