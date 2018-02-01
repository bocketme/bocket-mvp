module.exports = (socket, nodeId, comment, channelId) => {
    console.log("EMIT NEW ACTIVITY", {nodeId: nodeId, comment: comment});
    socket.to(channelId).emit('newActivityComment', {nodeId: nodeId, comment: comment});
};
