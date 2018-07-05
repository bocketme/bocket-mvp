const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;
