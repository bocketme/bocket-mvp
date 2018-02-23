module.exports = (io, nodeId, comment, channelId) => {
    console.log("EMIT NEW ACTIVITY", {nodeId: nodeId, comment: comment},channelId);
    io.to(channelId).emit('newActivityComment', {nodeId: nodeId, comment: comment});
};
