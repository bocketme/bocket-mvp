const workspaceSchema = require('../../models/Workspace');

module.exports = (io, socket) => {
  socket.on('[Workspace] - add', (name, productManager) => {
    const workspace = new workspaceSchema({

    });
    io.to().broadcast('[Workspace] - add', workspace._id, workspace.name);
  });
};