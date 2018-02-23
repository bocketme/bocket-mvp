const formatDate = require("../utils/formatDate");

module.exports = (io, socket, activity, viewType, channelId) => {
    if (!socket || !activity || !viewType)
        throw new Error("[getActivityCommentEmitter]: invalid parameter(s)");


    let today = new Date();
    activity.formatDate = formatDate(activity.date, today);
    console.log("newActivityEmitter", { viewType : viewType, activity: activity}, channelId);
    //io.to(socket.handshake.session.currentWorkspace).emit("newActivity", { viewType : viewType, activity: activity});
    socket.emit("newActivity", { viewType : viewType, activity: activity});
};
