const removeUserFromOW = 'removeUserFromOW';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const internalErrorEmitter = require('./emitter/internalErrorEmitter');

async function removeUserFromWorkspace(workspaceId, userEmail) {
    const { owner } = await WorkspaceModel.findById(workspaceId);
    if (userEmail === owner.email)
        return false;
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'team.members' : { email : userEmail }}});
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'users' : { email : userEmail }}});
    return true;
}

async function removeInWorkspace(organization, userEmail) {
    organization.workspaces.forEach(async function (elem) {
        await WorkspaceModel.update({ _id : elem.id }, { $pull : { 'team.members' : { email : userEmail }}});
        await WorkspaceModel.update({ _id : elem.id }, { $pull : { 'users' : { email : userEmail }}});
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
    socket.on(removeUserFromOW, ({ command, userEmail }) => {
        if (command === 'workspace') {
            removeUserFromWorkspace(socket.handshake.session.currentWorkspace, userEmail)
                .then((state) => {
                    socket.emit(removeUserFromOW, state);
                })
                .catch((err) => {
                    internalErrorEmitter(socket);
                });
        }
        if (command === 'organization') {
            removeUserFromOrganization(socket.handshake.session.currentWorkspace, userEmail)
                .then((state) => {
                    socket.emit(removeUserFromOW, state);
                })
                .catch((err) => {
                    internalErrorEmitter(socket);
                });
        }
    });
};