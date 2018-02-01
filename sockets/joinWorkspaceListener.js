let User = require("../models/User");

/**
 * Joins a socketIo channel when an user joins a workspace
 * @param socket : SocketIo
 */
function joinWorkspaceListener(io, socket) {
    let workspaceId = socket.handshake.session.currentWorkspace;
    let query = User.findOne({email: socket.handshake.session.userMail});
    query.elemMatch("workspaces", {"_id" : workspaceId})
        .then(user => {
            if (user !== null) {
                socket.join(workspaceId);
            }
        })
        .catch(err => console.log("[joinWorkspaceListener] Error : ", err));
}

module.exports = (io, socket) => {
    socket.on("joinWorkspace", () => {
        joinWorkspaceListener(io, socket);
    });
};
