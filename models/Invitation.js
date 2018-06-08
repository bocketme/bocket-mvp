const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const uid = require('uid-safe');
const mailTransporter = require('../utils/mailTransporter');
const Twig = require('twig');
const serverConfig = require('../config/server');

const mailConfig = require('../config/welcomeEmail');
const log = require('../utils/log');

const logValidate = log.child({ type: '' });

const nestedPeopleSchema = mongoose.Schema({
  completeName: String,
  email: { type: String, required: true },
});

const nestedWorkspaceSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: Number, required: true },
});

const nestedOrganization = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: Number, required: true },
});

const InvitationSchema = mongoose.Schema({
  uid: { type: String, default: '' },
  author: { type: String, required: true },
  authorId: mongoose.SchemaTypes.ObjectId,
  workspace: nestedWorkspaceSchema,
  organization: { type: nestedOrganization, required: true },
  people: nestedPeopleSchema,
});

InvitationSchema.pre('save', async function (next) {

  this.uid = await uid(42);

  if (!(this.organization.role > 3 && this.organization.role < 7))
    throw new Error('Cannot save an incorrect invitaiton');
  return this;
});

InvitationSchema.post('save', (invitation) => {
  let value, isWorkspace;
  if (invitation.workspace) {
    isWorkspace = true;
    value = invitation.workspace.name
  } else {
    isWorkspace = false;
    value = invitation.organization.name
  }

  const renderVar = {
    user: invitation.people.completeName,
    author: invitation.author,
    type: {
      isWorkspace,
      value,
    },
    invitationUid: invitation.uid
  };

  Twig.renderFile('./views/mail/invitation.twig', renderVar, (err, html) => {
    if (err) {
      console.error(err);
      return null;
    }
    else {
      let mailOptions = {
        from: mailConfig.email,
        to: invitation.people.email,
        subject: 'Une personne vous a invité a collaborer dans un espace de travail Bocket.',
        html,
      };
      mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error)
          reject(error);
        else
          console.log(`Email sent: ${info.response}`);
      });
    }
  });
});

nestedPeopleSchema.plugin(uniqueValidator);
nestedWorkspaceSchema.plugin(uniqueValidator);
InvitationSchema.plugin(uniqueValidator);
nestedOrganization.plugin(uniqueValidator);

const Invitation = mongoose.model('Invitation', InvitationSchema, 'Invitations');

module.exports = Invitation;
