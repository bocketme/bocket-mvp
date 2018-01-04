const formatDate = require("../utils/formatDate");

module.exports = (socket, activity, viewType) => {
    if (!socket || !activity || !viewType)
        throw new Error("[getActivityCommentEmitter]: invalid parameter(s)");

    let today = new Date();
    activity.formatDate = formatDate(activity.date, today);
    console.log("newActivityEmitter", { viewType : viewType, activity: activity});
    socket.emit("newActivity", { viewType : viewType, activity: activity});
};
