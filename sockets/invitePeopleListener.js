const invitePeople = 'invitePeople';
const validateEmail = require('../utils/validate/validateEmail');
const validateCompleteName = require('../utils/validate/validateCompleteName');
const Invitation = require('../models/Invitation');
const Workspace = require('../models/Workspace');
const log = require('../utils/log');
/**
 * InvitePeopleListener
 * @param workspaceId : {string}
 * @param data : { [{}] }
 */
function invitePeopleListener(workspaceId, author, data) {
  if (!data.length) return;

  console.log('WorkspaceId :', workspaceId);
  Workspace.findById(workspaceId)
    .then((workspace) => {
      const people = checkData(data);
      if (people.length && people.length > 0) {
        for (let i = 0; i < people.length; i += 1) {
          log.info('people = ', people);

          const invitation = new Invitation({
            workspace: { id: workspaceId, name: workspace.name },
            organization: { id: workspace.organization._id, name: workspace.organization.name },
            people: people[i],
            author,
          });

          invitation.save(invitation)
            .then(info => console.log('Invitation saved', info))
            .catch(err => console.log('error :', err));
        }
      }
    })
    .catch(err => console.log(invitePeople, 'error:', err));
}

function checkData(data) {
  const ret = [];
  for (let i = 0; i < data.length; i += 1) {
    log.info('data[i] = ', data[i]);
    if (validateEmail(data[i].email)) { ret.push(data[i]); }
  }
  return ret;
}

module.exports = (socket) => {
  socket.on(invitePeople, (data) => {
    console.log('data', data);
    invitePeopleListener(
      socket.handshake.session.currentWorkspace,
      socket.handshake.session.completeName,
      data,
    );
  });
};
