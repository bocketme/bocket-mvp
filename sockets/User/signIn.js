const { flatten } = require('lodash');
const order = 'signin';

const internalErrorEmitter = require('../emitter/internalErrorEmitter');
const User = require('../../models/User');
const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const acceptInvitation = require('../../utils/Invitations/acceptInvitation');

const log = require('../../utils/log');


module.exports = (io, socket) => {
  socket.on(order, async ({ email, password, invitationUid }) => {
    const user = await User.findOne({ email })
      .exec();

    if (!user) return socket.emit('signinFailed');

    const simplifiedUser = {
      _id: user._id,
      completeName: user.completeName,
      email: user.email
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return socket.emit('signinFailed');

    if (invitationUid) return await emitWithInvitation(invitationUid, user, socket);

    const { Manager } = user;
    let works = [];

    for (let i = 0; i < Manager.length; i++) {
      const { Organization, Workspaces } = Manager[i];
      const organization = await organizationSchema.findById(Organization);
      for (let j = 0; j < Workspaces.length; j++) {
        const workspace = await workspaceSchema.findById(Workspaces[j]);
        works.push({
          name: workspace.name,
          _id: workspace._id,
          organization: organization.name
        });
      }
    }

    return socket.emit('signinSucced', { workspaces: works, user: simplifiedUser, organization: [] });
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
