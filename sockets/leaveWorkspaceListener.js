/**
 * Leaves a socketIo channel when an user leaves a workspace
 * @param socket : SocketIo
 * @param workspaceId : String
 */
function leaveWorkspaceListener(io, socket, workspaceId) {
    socket.leave(workspaceId);
}

module.exports = (io, socket) => {
    socket.on("leaveWorkspace", (workspaceId) => {
        leaveWorkspaceListener(io, socket, workspaceId);
    });
};
