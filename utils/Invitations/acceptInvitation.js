const Invitation = require('../../models/Invitation');
const organisationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');

async function acceptInvitation (invitationUid, user) {
  const invitation = await Invitation.findOne({ uid: invitationUid });
  if (!invitation) throw new Error('[Invitaiton] - Invitation Not Found');
  const { workspace, organization } = invitation;

  const result = {};

  const Organization = await organisationSchema.findById(invitation.organization.id);
  if (organization) {
    result.organizationId = Organization._id;
    switch (organization.role) {
      case 5:
        await Organization.addAdmin(user._id).catch(err => log.warn('[Organization] - The user already exists. skipping... \n' + err));
        break;
      case 4:
        await Organization.addMember(user._id).catch(err => log.warn('[Organization] - The user already exists. skipping...' + err));
        break;
      default:
        throw new Error(`The Organization has no role or the role is incorect, role = ${role}`);
    }
  } else throw new Error('You cannot invite people without an organization');

  if (workspace) {
    const Workspace = await workspaceSchema.findById(invitation.workspace.id);
    result.workspaceId = Workspace._id;
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
  } else {
    await invitation.remove();
    result.url = `/organization/${Organization._id}`;
    return result;
  }
}

module.exports = acceptInvitation;
