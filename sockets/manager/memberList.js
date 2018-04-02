const listenerPreName = '[Manager] - [MemberList] - ';
const WorkspaceModel = require('../../models/Workspace');
const OrganizationModel = require('../../models/Organization');
const log = require('../../utils/log');

/**
 * 
 * 
 * @param {any} workspaceId 
 * @param {any} userMail 
 * @returns 
 */
async function workspaceInformation (workspaceId, userMail) {
  const { owner, users, team, name } =
    await WorkspaceModel // Search in the workspace Model
      .findById(workspaceId) // The document with this Id
      .catch(err => { throw err }); // If there is an error, it throws it
  return (workspaceId, { isOwner: owner.email === userMail, owners: team.owners, members: [...users, ...team.members], name: name });
}

/**
 * 
 * 
 * @param {any} workspaceId 
 * @param {any} userMail 
 * @returns 
 */
async function organizationInformation (workspaceId, userMail) {
  const { organization } =
    await WorkspaceModel
      .findById(workspaceId)
      .catch(err => console.error(err));
  const { owner, members } = await OrganizationModel
    .findById(organization._id)
    .catch(err => console.error(err));
  return (organization._id, { id: organization._id, isOwner: owner[0].email === userMail, owners: owner, members, name: organization.name });
}

function listenerName (name) {
  return listenerName.concat(name)
}

module.exports = (socket) => {

  const GetInformation = listenerName('GetInformation')

  socket.on(GetInformation, ({ type, id = socket.handshake.session.currentWorkspace }) => {
    switch (type) {
      case 'Workspace':
        workspaceListener(id, socket.handshake.session.userMail)
          .then((data) => {
            console.log('data : ', data);
            socket.emit(GetInformation, { type, id, data });
          })
          .catch(err => log.error(err));
        break;

      case 'Organization':
        organizationListener(id, socket.handshake.session.userMail)
          .then((id, data) => {
            socket.emit(GetInformation, { type, data });
          })
          .catch(err => log.error(err));
        break;

      default:
        socket.emit(GetInformation, null);
    }
  })
}
