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
            addCommentActivity($(activityCommentsId + " li:first"), {author: "Vincent Mesquita", content: $(this).val(), date: new Date}, view);
            $(this).val(empty);
        }
    });

    socket.on("getActivityComments", function (comments) {
        console.log("Nouveau commentaire", comments);
        clearComments($("#activity-comments"));
        for (var i = comments.length - 1; i >= 0 ; i--) {
            let comment = comments[i];
            printActivityComment($(activityCommentsId + " li:first"), comment, comment.formatDate);
        }
    });

});

/**
 * Clear the comments
 * @Param ulCollection : JqueryElement
 */
function clearComments(ulCollection) {
    let liArray = ulCollection.children();

    for (var i = 1 ; i < liArray.length ; i++) {
        liArray[i].remove();
    }
}

/**
 * Add a comment activity
 * @Param lastComent = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 */
function addCommentActivity(lastComment, comment, view) {
    // TODO: Send comment to the Back-End (WORK IN PROGRESS)
    socket.emit(newComment, {nodeId: idOfchoosenNode, comment: comment, viewType: view});
}

/**
 *
 * @Param lastComent = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 * @param when Date
 */
function printActivityComment(lastComment, comment, when) {
    lastComment.after("<li>" +
        "<div class=\"row\">\n" +
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
        "</div>" +
        "</li>");
}