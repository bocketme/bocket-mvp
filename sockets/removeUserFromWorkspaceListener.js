const removeUserFromWorkspaceName = 'removeUserFromWorkspace';
const WorkspaceModel = require('../models/Workspace');
const internalErrorEmitter = require('./emitter/internalErrorEmitter');

async function removeUserFromWorkspace(workspaceId, userEmail) {
    const { owner } = await WorkspaceModel.findById(workspaceId);
    if (userEmail === owner.email)
        return false;
    await WorkspaceModel.update({ _id : workspaceId }, { $pull : { 'team.members' : { email : userEmail }}});
    return true;
}

module.exports = (socket) => {
    socket.on(removeUserFromWorkspaceName, ({ userEmail }) => {
        removeUserFromWorkspace(socket.handshake.session.currentWorkspace, userEmail)
            .then((state) => {
                socket.emit(removeUserFromWorkspaceName, state);
            })
            .catch((err) => {
                internalErrorEmitter(socket);
            });
    });
};