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

InvitationSchema.pre('save', function (next) {
  const invitation = this;
  uid(42)
    .then((uid) => {
      invitation.uid = uid;
      logInvitation.info('UID = ', invitation.uid);
      next();
    })
    .catch(err => next(err));
});

InvitationSchema.post('save', (invitation) => {
  logInvitation.info('ici');
  logInvitation.info('serverConfig url :', serverConfig.url);

  let httpURL = '';
  // httpURL = serverConfig.protocol+ "://www.bocket.me:" + serverConfig.port;
  httpURL = `${serverConfig.protocol}://localhost:${serverConfig.port}`;
  logInvitation.info('http url :', httpURL);

  const renderVar = {
    completeName: invitation.people.completeName,
    workspace: invitation.workspace,
    author: invitation.author,

    // url: serverConfig.url + "/" + invitation.uid
    url: `${httpURL}/${invitation.uid}`,

  };
    // http://localhost:8080/project/5a4f4a87488d0c0770f8bef0
  Twig.renderFile('./views/invitation.twig', renderVar, (err, html) => {
    const mailOptions = {
      from: mailConfig.email,
      to: invitation.people.email,
      subject: 'Someone invited you to collaborate into a bocket 3D workspace',
      html,
      // html: `uid = <a href="google.com">${invitation.uid}</a>`
    };

    logInvitation.info('mailOptions = ', mailOptions);

    mailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logInvitation.info(error);
      } else {
        logInvitation.info(`Email sent: ${info.response}`);
      }
    });
  });
});

nestedPeopleSchema.plugin(uniqueValidator);
nestedWorkspaceSchema.plugin(uniqueValidator);
InvitationSchema.plugin(uniqueValidator);
nestedOrganization.plugin(uniqueValidator);

const Invitation = mongoose.model('Invitation', InvitationSchema, 'Invitations');

module.exports = Invitation;
