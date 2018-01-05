/**
 * Leaves a socketIo channel when an user leaves a workspace
 * @param socket : SocketIo
 * @param workspaceId : String
 */
function leaveWorkspaceListener(socket, workspaceId) {
    socket.leave(workspaceId);
}

module.exports = (socket) => {
    socket.on("joinWorkspace", (workspaceId) => {
        leaveWorkspaceListener(socket, workspaceId);
    });
};
