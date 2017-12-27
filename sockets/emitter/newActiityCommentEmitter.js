module.exports = (socket, nodeId, comment) => {
    console.log("EMIT NEW ACTIVITY", {nodeId: nodeId, comment: comment});
    socket.emit('newActivityComment', {nodeId: nodeId, comment: comment});
};
