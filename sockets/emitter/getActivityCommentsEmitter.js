/**
 * Send n last ativities
 * @param socket
 * @param all activities of node/part/assembly
 * @param nbr
 * @param viewType
 */
module.exports = (socket, activities, viewType, nbr) => {
    let today = new Date();
    let ret = { viewType : viewType, activities: [] };
    let count = 0;
    if (nbr === undefined) nbr = 1;

    if (!socket || !activities || nbr <= 0)
        throw new Error("[getActivityCommentEmitter]: invalid parameter(s)");
    for (let i = activities.length - 1 ; i >= 0 && count < nbr; i--) {
        activities[i].formatDate = formatDate(activities[i].date, today);
        ret.activities.push(activities[i]);
        count += 1;
    }
    console.log("getActivityComments", ret, nbr);
    //console.log("EMIT :", ret);
    socket.emit("getActivityComments", ret);
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