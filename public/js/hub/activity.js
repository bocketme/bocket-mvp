var newComment = "newActivityComment";

$(document).ready(function() {
    var activityCommentsId = "#activity-comments";
    var empty = "";

    /**
     * Upload a file
     */
    $(".activity-upload").on("click", function () {
        $("#activity-uploader").click();
    });

    /**
     * Slide input comment
     */
    $(".comment").on("click", function() {
        console.log("[.comment] onClick", $($(this).prev().children()[0]));
        $(this).prev().slideToggle(function() {
            $(this).children().trigger("select");
        });
    });

    /**
     * Used when a key enter is pressed on input
     * @Param e : event
     */
    $("#add-comment-input").keydown(function (e) {
        if (e.which === 13 && $(this).val() !== empty) {
            addCommentActivity($(activityCommentsId + " li:first"), {author: "Vincent Mesquita", content: $(this).val(), date: new Date});
            $(this).val(empty);
        }
    });

    socket.on("getActivityComments", function (comments) {
        console.log("Nouveau commentaire", comments);
        for (var i = comments.length - 1; i >= 0 ; i--) {
            let comment = comments[i];
            printActivityComment($(activityCommentsId + " li:first"), comment, comment.formatDate);
        }
    });

});

var d = new Date(2017, 11, 9);

/**
 * Add a comment activity
 * @Param lastComent = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 */
function addCommentActivity(lastComment, comment) {
    /*var today = new Date();
    var when = "today";
    var diff = new Date(today.getTime() - comment.date.getTime());
    var v;

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
        when = (v > 0) ? (v + " days ago") : ("today");*/
    //printActivityComment(lastComment, comment, when);
    // TODO: Send comment to the Back-End (WORK IN PROGRESS)
    socket.emit(newComment, {nodeId: idOfchoosenNode, comment});
}

/**
 *
 * @Param lastComent = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 * @param when Date
 */
function printActivityComment(lastComment, comment, when) {
    lastComment.after("<div class=\"row\">\n" +
        "    <div class=\"col s12\">\n" +
        "        <div class=\"card\">\n" +
        "            <div class=\"card-content white-text\">\n" +
        "                <div class=\"row\">\n" +
        "                    <div>\n" +
        "                        <img class=\"col s2\" src=\"/img/vincent_mesquita.jpg\">\n" +
        "                        <span class=\"card-title s10\"> <span class=\"who\">" + comment.author + "</span> <span class=\"what\">added a comment</span>, <span class=\"when\">" + when + "</span></span>\n" +
        "                    </div>\n" +
        "                    <p class=\"col s12\">"+ comment.content +"</p>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"card-action row\">\n" +
        "                <div class=\"cache-toi\" style=\"display: none;\">\n" +
        "                    <input class=\"comment-input\" placeholder=\"Add your comment...\" type=\"text\">\n" +
        "                </div>\n" +
        "                <div class=\"chip comment\">\n" +
        "                    <span class=\"chip-content\">Comment</span>\n" +
        "                </div>\n" +
        "                <div class=\"chip activity-upload\">\n" +
        "                    <span class=\"chip-content\">Attach a file</span>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>");
}