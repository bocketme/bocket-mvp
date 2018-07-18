const Invitation = require('../../models/Invitation');
const organisationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');



async function sendNewsfeed(authorId, userId, workspaceId) {
  var socket = require('socket.io-client')('http://localhost:8080');
  socket.on('connect', () => {
    const news = {
      type: 'USER',
      author: { _id: authorId },
      content: {
        method: 'ADD',
        target: { _id: userId, name: '' },
        role: '',
      },
    };
    socket.emit('[Newsfeed] - addFromWorkspace', news, workspaceId);
  });
}

async function acceptInvitation(invitationUid, user) {
  const invitation = await Invitation.findOne({ uid: invitationUid });
  if (!invitation) throw new Error('[Invitaiton] - Invitation Not Found');
  const { workspace, organization, authorId } = invitation;

  const result = {};
  result.authorId = authorId;
  const Organization = await organisationSchema.findById(invitation.organization.id);
  if (organization) {
    result.organizationId = Organization._id;
    switch (organization.role) {
      case 5:
        await Organization.addAdmin(user._id).catch(err => log.warn(`[Organization] - The user already exists. skipping... \n${err}`));
        break;
      case 4:
        await Organization.addMember(user._id).catch(err => log.warn(`[Organization] - The user already exists. skipping...${err}`));
        break;
      default:
        throw new Error(`The Organization has no role or the role is incorect, role = ${role}`);
    }
  } else throw new Error('You cannot invite people without an organization');

  if (workspace) {
    const Workspace = await workspaceSchema.findById(invitation.workspace.id);
    result.workspaceId = Workspace._id;
    sendNewsfeed(authorId, user._id, Workspace._id);
    try {
      switch (workspace.role) {
        case 3:
          await Workspace.addProductManager(user._id);
          break;
        case 2:
          await Workspace.addTeammate(user._id);
          break;
        case 1:
          throw new Error('Cannot use Observer');
        /*
          await Workspace.addObserver(user._id);
          break;
        */
        default:
          throw new Error('The Workspace has no role');
      }
    } catch (error) {
      await invitation.remove();
      result.url = `/organization/${Organization._id}`;
      return result;
    }
    await invitation.remove();
    result.url = `/workspace/${Workspace._id}`;
    return result;
  }
  await invitation.remove();
  result.url = `/organization/${Organization._id}`;
  return result;
}

module.exports = acceptInvitation;
