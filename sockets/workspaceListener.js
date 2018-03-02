const workspaceListener = "workspaceManager";
const WorkspaceModel = require('../models/Workspace');

async function wokspaceListener(workspaceId) {
    //return { members } = await WorkspaceModel.findById(workspaceId);
    return await WorspaceModel.findById(worspaceId).members;
}

module.exports = (socket) => {
    socket.on(workspaceListener, ({ type }) => {

        if (type === "workspace") {
            workspaceListener(socket.handshake.session.currentWorkspace)
                .then(data => {
                    console.log(data);
                    socket.emit(data);
                })
                .catch(console.log);
            }
    });
};