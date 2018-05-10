const Invitation = require('../../models/Invitation');
const Organisation = require('../../models/Organization');
const Workspace = require('../../models/Workspace');
const _ =  require('lodash');
const invitationError = { code: 1, message: 'Invalid Invitation' };
const internalError = { code: 2, message: 'Internal Error' };

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

    let indiceOrganization = _.findIndex(user.Organization, function({_id}) {
      const id1 = String(_id);
      const id2 = String(inv.organization.id);
      console.log(id1 === id2);
      return id1 === id2;
    });
    if (indiceOrganization && indiceOrganization !== -1)
      user.Organization[indiceOrganization].workspaces.push(inv.workspace.id);
    else
      user.Organization.push({_id: inv.organization.id, workspaces: [inv.workspace.id]});

    user.save()
      .then(() => {
        Workspace.findOne({ _id: inv.workspace.id })
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
