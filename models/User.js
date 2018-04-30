const serverConfiguration = require('../config/server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const util = require('util');

const NestedWorkspaceSchema = require('./nestedSchema/NestedWorkspaceSchema');
const NestedOrganizationSchema = require('./nestedSchema/NestedOrganizationSchema');
const compare = util.promisify(bcrypt.compare);

const UserSchema = new mongoose.Schema({
  completeName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: Boolean,
  createDate: Date,
  workspaces: { type: [NestedWorkspaceSchema] },
  organizations: { type: [NestedOrganizationSchema] },
  avatar: { type: String, default: 'bocket.png' },
  //TODO: Create a forget password context.
  forget: {
    active: { type: Boolean, default: false },
    key: String
  },
  options: {
    cellShading: { type: Boolean, default: false },
    colorBackground: {type: String, default: "#e0e0e0" },
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

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  if (candidatePassword === null) { cb(err); }
  else {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }
};

UserSchema.methods.comparePassword.promise = async (candidatePassword, currentPassword) => {
  // why this.password is undefined ?????????????????
  if (candidatePassword === null) { throw Error('need candidatePassword'); }
  else {
    const b = await compare(candidatePassword, currentPassword);
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
