const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Tchat] - remove', (tchat) => {
    Workspace
      .findById(socket.handshake.session.currentWorkspace)
      .then(workspaces => {
        workspaces.Tchats =
                    workspaces
                      .Tchats
                      .filter(nestedTchat => String(nestedTchat._id) !== tchat._id);
        return workspaces.save();
      })
      .then(() => {
        socket.broadcast.to(socket.handshake.session.currentWorkspace).emit('[Tchat] - remove', tchat);
        socket.emit('[Tchat] - remove', tchat);
      });
  });
};
