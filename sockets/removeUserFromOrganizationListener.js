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
    const { organization } = await WorkspaceModel.findById(workspaceId);
    const userOrganization = await OrganizationModel.findById(organization.id);
    removeInWorkspace(userOrganization, userEmail);
    await OrganizationModel.update({ _id : organization.id }, { $pull : { 'members' : { email : userEmail }}});
    return userOrganization;
}

module.exports = (socket) => {
    socket.on(removeUserFromOrganizationName, ({ userEmail }) => {
        removeUserFromOrganization(socket.handshake.session.currentWorkspace, userEmail)
            .then((workspace) => {
                socket.emit(removeUserFromOrganizationName, true);
            })
            .catch((err) => {
                internalErrorEmitter(socket);
            });
    });
};