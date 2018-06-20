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
    const user = await User
      .findOne({ email })
      .populate({path: 'Manager.Organization', select:'name'})
      .exec();

    if (!user) return socket.emit('signinFailed');

    const simplifiedUser = {
      _id: user._id,
      completeName: user.completeName,
      email: user.email
    };

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return socket.emit('signinFailed');

    if (invitationUid) {
      const newWorkspace = await acceptInvitation(invitationUid, user);
      return socket.emit('signinSucced', newWorkspace.url)
    }

    const { Manager } = user;
    console.info(Manager)
    let works = [], organizations = [];

    for (let i = 0; i < Manager.length; i++) {
      const { Organization, Workspaces } = Manager[i];
      const organization = await organizationSchema.findById(Organization);
      organizations.push({
        name: organization.name,
        _id: organization._id,
      });
      for (let j = 0; j < Workspaces.length; j++) {
        const workspace = await workspaceSchema.findById(Workspaces[j]);
        if (workspace) {
          works.push({
            name: workspace.name,
            _id: workspace._id,
            organization: organization.name
          });
        } else await user.removeWorkspace(organization._id, Workspaces[j])
      }
    }

    return socket.emit('signinSucced', { workspaces: works, user: simplifiedUser, organization: organizations });
  });
  async function emitWithInvitation(invitationUid, user, socket) {
    
  }
};
