const formatDate = require("../utils/formatDate");

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
        let o = JSON.parse(JSON.stringify(activities[i]));
        o.formatDate = formatDate(activities[i].date, today);
        o.index = i;
        ret.activities.push(o);
        count += 1;
    }
    //console.log("getActivityCommentssssss", ret, nbr);
    socket.emit("getActivities", ret);
};
