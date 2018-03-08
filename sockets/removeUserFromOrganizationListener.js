const removeUserFromOrganizationName = 'removeUserFromOrganization';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const internalErrorEmitter = require('./emitter/internalErrorEmitter');

async function removeInWorkspace(organization, userEmail) {
    organization.workspaces.forEach(async function (elem) {
        await WorkspaceModel.update({ _id : elem.id }, { $pull : { 'team.members' : { email : userEmail }}});
    });
}

async function removeUserFromOrganization(workspaceId, userEmail) {
    const { owner, organization } = await WorkspaceModel.findById(workspaceId);
    const workspaceOrganization = await OrganizationModel.findById(organization.id);
    if (userEmail === owner.email)
        return false;
    removeInWorkspace(workspaceOrganization, userEmail)
        .catch((err) => {
            throw err;
        });
    await OrganizationModel.update({ _id : organization.id }, { $pull : { 'members' : { email : userEmail }}});
    return true;
}

module.exports = (socket) => {
    socket.on(removeUserFromOrganizationName, ({ userEmail }) => {
        removeUserFromOrganization(socket.handshake.session.currentWorkspace, userEmail)
            .then((state) => {
                socket.emit(removeUserFromOrganizationName, state);
            })
            .catch((err) => {
                internalErrorEmitter(socket);
            });
    });
};