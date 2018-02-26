const Invitation = require('../../models/Invitation');
const Organisation = require('../../models/Organization');
const Workspace = require('../../models/Workspace');
const Team = require('../../models/Team');

const log = require('../../utils/log');
const invitationError = { code: 1, message: 'Invalid Invitation' };
const internalError = { code: 2, message: 'Internal Error' };

/**
 * Accept the Invitation
 * @param invitationUid : {String}
 * @param user : {Mongoose}
 * @return {Promise}
 */
function acceptInvitation(invitationUid, user) {
  
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
        
        updateOwnerOrganization(user, workspace.organization._id)
          .then((orga) => {
            updateTeam(workspace, user)//maj guillaume
              .then(()=>{
              resolve({ workspaceId: workspace._id });
              invitation.remove();
            })
            .catch();
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
    user.workspaces.push({ _id: inv.workspace.id, name: inv.workspace.name });
    user.organizations.push({ _id: inv.organization.id, name: inv.organization.name });
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

function updateWorkspace(workspace, user) {//update team also
  return new Promise((res, rej) => {
    console.log('workspace = ', workspace);
    workspace.users.push({ _id: user._id, completeName: user.completeName, email: user.email });
    workspace.save()
      .then(w => 
        res(w)
      )
      .catch(err => rej(err));
  });
}
async function updateTeam(workspace, user) {
  teamId=workspace.team._id;  
  const team = await Team.findById(teamId);  
   // console.log("Team ds func async = ", team);
    team.members.push({_id: user._id, completeName: user.completeName, email: user.email});
    await team.save().catch(err => log.error (err)); 
}

async function updateOwnerOrganization({ _id, completeName, email }, organizationId) {
  const orga = await Organisation.findById(organizationId);
  orga.members.push({ _id, completeName, email });
  await orga.save();
}

module.exports = acceptInvitation;
