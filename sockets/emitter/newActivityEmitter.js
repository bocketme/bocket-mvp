const formatDate = require("../utils/formatDate");

module.exports = (io, socket, activity, viewType, channelId, userMail) => {
    if (!socket || !activity || !viewType)
        throw new Error("[getActivityCommentEmitter]: invalid parameter(s)");


    let today = new Date();
    activity.formatDate = formatDate(activity.date, today);
    console.log("newActivityEmitter", { viewType : viewType, activity: activity}, channelId, userMail, socket.handshake.session.completeName);
    io.to(channelId).emit("newActivity", { viewType : viewType, activity: activity, user_email: userMail, username: socket.handshake.session.completeName});
};
