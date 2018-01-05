/**
 * Joins a socketIo channel when an user joins a workspace
 * @param socket : SocketIo
 * @param workspaceId : String
 */
function joinWorkspaceListener(socket, workspaceId) {
    socket.join(workspaceId);
}

module.exports = (socket) => {
    socket.on("joinWorkspace", (workspaceId) => {
        joinWorkspaceListener(socket, workspaceId);
    });
};
