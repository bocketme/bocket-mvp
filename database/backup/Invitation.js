const mongoose = require('mongoose');

const nestedPeopleSchema = mongoose.Schema({
  completeName: String,
  email: { type: String, required: true },
});

const nestedWorkspaceSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: Number, required: true, default: 2 },
});

const nestedOrganization = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: Number, required: true, default: 4 },
});

const InvitationSchema = mongoose.Schema({
  uid: { type: String, default: '' },
  author: { type: String, required: true },
  authorId: mongoose.SchemaTypes.ObjectId,
  workspace: nestedWorkspaceSchema,
  organization: { type: nestedOrganization, required: true },
  people: nestedPeopleSchema,
});

const Invitation = mongoose.model('Invitation', InvitationSchema, 'Invitations');

module.exports = Invitation;
