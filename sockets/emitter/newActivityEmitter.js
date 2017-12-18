module.exports = (socket, activity, viewType) => {
    if (!socket || !activity || !viewType)
        throw new Error("[getActivityCommentEmitter]: invalid parameter(s)");

    let today = new Date();
    activity.formatDate = formatDate(activity.date, today);
    console.log("newActivityEmitter", { viewType : viewType, activity: activity});
    socket.emit("newActivity", { viewType : viewType, activity: activity});
};

/**
 * format the date to ""
 * @param date : string
 * @param today : Date
 * @returns {string}
 */
function formatDate(date, today) {
    let when = "today";
    let newDate = new Date(date);
    let diff = new Date(today.getTime() - newDate.getTime());
    let v;

    if (diff < 0)
        when = "today";
    else if ((v = diff.getUTCFullYear() - 1970) > 0)
        when = (v > 1) ? (v + " years ago") : ("1 year ago");
    else if ((v = diff.getUTCMonth()) > 0)
        when = (v > 1) ? (v + " months ago") : ("1 month ago");
    else if ((v = diff.getUTCDate() - 1) >= 7) {
        v = Math.floor(v / 7);
        when = (v > 1) ? (v + " weeks ago") : ("1 week ago");
    }
    else
        when = (v > 0) ? (v + " days ago") : ("today");
    return when;
}