module.exports = function (socket) {
  socket.on("newNode", (context) => { // context = {workspaceId, nodeInformation }
      //TODO: check if
      console.log("userMail:", socket.handshake.session.userMail);
      console.log("workspaceId:", context.workspaceId);
      console.log("node:", context.node);
  })
};