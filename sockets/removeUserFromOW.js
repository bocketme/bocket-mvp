const removeUserFromOW = 'removeUserFromOW';
const WorkspaceModel = require('../models/Workspace');
const OrganizationModel = require('../models/Organization');
const UserModel = require('../models/User')
const internalErrorEmitter = require('./emitter/internalErrorEmitter');

async function removeUserFromWorkspace(workspaceId, ownerMail, userEmail) {
    const { owner } = await WorkspaceModel.findById(workspaceId);
    const user = await UserModel.find({ email : userEmail });
    if (userEmail === owner.email)
        return false;
    if (ownerMail !== owner.email)
        return false;
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'team.members' : { email : userEmail }}});
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'users' : { email : userEmail }}});
    await UserModel.update({ _id : user.id }, { $pull : { workspaces : { _id : workspaceId }}});
    return true;
}

async function removeInWorkspace(organization, userEmail) {
    const user = await UserModel.find({ email : userEmail });
    organization.workspaces.forEach(async function (elem) {
        await UserModel.update({ _id : user.id }, { $pull : { workspaces : { _id : elem.id }}});
        await WorkspaceModel.update({ _id : elem.id }, { $pull : { 'team.members' : { email : userEmail }}});
        await WorkspaceModel.update({ _id : elem.id }, { $pull : { 'users' : { email : userEmail }}});
    });
}

async function removeUserFromOrganization(workspaceId, ownerMail, userEmail) {
    const { owner, organization } = await WorkspaceModel.findById(workspaceId);
    const workspaceOrganization = await OrganizationModel.findById(organization.id);
    if (userEmail === owner.email)
        return false;
    if (ownerMail !== owner.email)
        return false;
    removeInWorkspace(workspaceOrganization, userEmail)
        .catch((err) => {
            throw err;
        });
    await OrganizationModel.update({ _id : organization.id }, { $pull : { 'members' : { email : userEmail }}});
    const user = await UserModel.find({ email : userEmail });
    await UserModel.update({ _id : user.id }, { $pull : { organization : { _id : organization.id }}});
    return true;
}

module.exports = (socket) => {
    socket.on(removeUserFromOW, ({ command, userEmail }) => {
        if (command === 'workspace') {
            removeUserFromWorkspace(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail, userEmail)
                .then((state) => {
                    socket.emit(removeUserFromOW, state);
                })
                .catch((err) => {
                    internalErrorEmitter(socket);
                });
        }
        if (command === 'organization') {
            removeUserFromOrganization(socket.handshake.session.currentWorkspace, socket.handshake.session.userMail, userEmail)
                .then((state) => {
                    socket.emit(removeUserFromOW, state);
                })
                .catch((err) => {
                    internalErrorEmitter(socket);
                });
        }
    });
};