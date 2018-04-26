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
        socket.emit('Info', 'The Tchat was deleted');
        io
          .in(socket.handshake.session.currentWorkspace)
          .emit('[Tchat] - remove', tchat);
      });
  });
};
