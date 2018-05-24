const Invitation = require('../../models/Invitation');
const organisationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const _ = require('lodash');
const invitationError = { code: 1, message: 'Invalid Invitation' };
const internalError = { code: 2, message: 'Internal Error' };

async function acceptInvitation(invitationUid, user) {
  const invitation = await Invitation.findOne({ uid: invitationUid });
  if (!invitation) throw new Error('[Invitaiton] - Invitation Not Found');
  const { workspace, organization } = invitation;

  if (organization) {
    const Organization = await organisationSchema.findById(invitation.organization.id);
    switch (organization.role) {
      case 5:
        await Organization.addAdmin(user._id);
        break;
      case 4:
        await Organization.addMember(user._id);
        break;
      default:
        throw new Error('The Organization has no role');
        break;
    }
  } else throw new Error('You cannot invite people without an organization')


  if (workspace) {
    const Workspace = await workspaceSchema.findById(invitation.Workspace.id);
    switch (workspace.role) {
      case 1:
        await Workspace.addProductManager(user._id);
        break;
      case 2:
        await Workspace.addTeammate(user._id);
        break;
      case 3:
        throw new Error('Cannot use Observer');
        //Workspace.addObserver(user._id);
        break;
      default:
        throw new Error('The Workspace has no role');
        break;
    }
    await invitation.remove();
    return `/project/${Workspace._id}`;
  } else {
    await invitation.remove();
    return `/organization/${Organization._id}`;    
  } 
}

/**
 * Accept the Invitation
 * @param invitationUid : {String}
 * @param user : {Mongoose}
 * @return {Promise}
 */
function acceptInvitation(invitationUid, user) {
  //            .then(res => updateTeam(res.team, res.user))
  return new Promise((resolve, rej) => {
    let invitation = null;
    Invitation.findOne({ uid: invitationUid })
      .then((inv) => {
        if (inv === null) rej();
        invitation = inv;
        return updateUser(inv, user);
      })
      .then(res => updateWorkspace(res.workspace, res.user))
      .then((workspace) => {
        updateOwnerOrganization(user, workspace.Organization)
          .then(() => {
            resolve({ workspaceId: workspace._id });
            invitation.remove();
          })
          .catch();
      })
      .catch((err) => {
        rej(err);
      });
  });
}

function updateUser(inv, user) {
  return new Promise((res, rej) => {
    if (inv === null) rej(invitationError);

    let indiceOrganization = _.findIndex(user.Organization, function ({ _id }) {
      const id1 = String(_id);
      const id2 = String(inv.organization.id);
      console.log(id1 === id2);
      return id1 === id2;
    });
    if (indiceOrganization && indiceOrganization !== -1)
      user.Organization[indiceOrganization].workspaces.push(inv.workspace.id);
    else
      user.Organization.push({ _id: inv.organization.id, workspaces: [inv.workspace.id] });

    user.save()
      .then(() => {
        workspaceSchema.findOne({ _id: inv.workspace.id })
          .then((w) => {
            console.log('w =', w);
            res({ workspace: w, user });
          })
          .catch(err => rej(err));
      })
      .catch(err => rej(err));
  });
}

function updateWorkspace(workspace, user) {
  return new Promise((res, rej) => {
    console.log('workspace = ', workspace);
    workspace.Teammates.push(user._id);
    workspace.save()
      .then(w => res(w))
      .catch(err => rej(err));
  });
}
/*function updateTeam(team, user) {
    return new Promise((res, rej) => {
        console.log("Team = ", team);
        team.members.push({_id: user._id, completeName: user.completeName, email: user.email});
        team.save()
            .then((w) => res(w._id))
            .catch(err => rej(err));
    });
} */

async function updateOwnerOrganization({ _id }, organizationId) {
  const orga = await Organisation.findById(organizationId);
  orga.Members.push(_id);
  orga.save();
}

module.exports = acceptInvitation;
