const {flatten} = require('lodash');
const order = 'signin';

const internalErrorEmitter = require('../emitter/internalErrorEmitter');
const User = require('../../models/User');
const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const acceptInvitation = require('../../utils/Invitations/acceptInvitation');

const log = require('../../utils/log');


module.exports = (io, socket) => {
  socket.on(order, async({email, password, invitationUid}) => {
    const user = await User.findOne({email});

    if(!user) return socket.emit('signinFailed');

    const simplifiedUser = {
      _id : user._id,
      completeName: user.completeName,
      email: user.email
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return socket.emit('signinFailed');

    if (invitationUid) return emitWithInvitation(invitationUid, user, socket);

    const { Organization } = user;
    let works = [];
    for (let i = 0; i < Organization.length; i++) {
      const organization = await organizationSchema.findById(Organization[i]._id);
      for (let j = 0; j < Organization[i].workspaces.length; j++) {
        const workspace = await workspaceSchema.findById(Organization[i].workspaces[j]);
        works.push({
          name: workspace.name,
          _id: workspace._id,
          organization: organization.name
        });
      }
    }

    return socket.emit('signinSucced', {workspaces: works, user: simplifiedUser, organization: []});
  });
};

function emitWithInvitation(invitationUid, user, socket) {
  acceptInvitation(invitationUid, user)
    .then(res => socket.emit('signinSucced', res.workspaceId))
    .catch((err) => {
      console.log(err);
      internalErrorEmitter(socket);
    });
}