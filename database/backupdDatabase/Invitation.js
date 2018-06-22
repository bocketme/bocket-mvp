const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uid = require('uid-safe');
const mailTransporter = require('../utils/mailTransporter');
const Twig = require('twig');
const serverConfig = require('../config/server');

const mailConfig = require('../config/welcomeEmail');
const log = require('../utils/log');

const nestedPeopleSchema = mongoose.Schema({
  completeName: String,
  email: { type: String, required: true },
});

const nestedWorkspaceSchema = mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const nestedOrganization = mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const InvitationSchema = mongoose.Schema({
  uid: { type: String, default: '' },
  author: { type: String, required: true },
  workspace: { type: nestedWorkspaceSchema, required: true },
  organization: { type: nestedWorkspaceSchema, required: true },
  people: { type: nestedPeopleSchema },
});

const Invitation = mongoose.model('Invitation', InvitationSchema, 'Invitations');

module.exports = Invitation;
