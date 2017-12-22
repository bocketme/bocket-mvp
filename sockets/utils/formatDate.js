module.exports = formatDate;

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
    console.log("WHEN: ", when);
    return when;
}