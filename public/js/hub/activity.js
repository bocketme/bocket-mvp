var newComment = "newActivityComment";

$(document).ready(function() {
    $('.profile').initial();
    var empty = "";

    $(".activity-upload").on("click", uploadFile);
    $(".comment").on("click", slideInputComment);

    /**
     * Used when a key enter is pressed on input
     * @Param e : event
     */
    $(".add-comment-input").keydown(function (e) {
        if (e.which === 13 && $(this).val() !== empty) {
            var ul = (view === ViewTypeEnum.location) ? ("#activity-comments-location") : ("#activity-comments-content");
            addCommentActivity($(ul + " li:first"), {content: $(this).val(), date: new Date}, view);
            $(this).val(empty);
        }
    });

    /**
     * Get the last activity
     * @param context : {{ viewType : String, activities : [String] }}
     */
    socket.on("getActivityComments", function (context) {
        var activities = context.activities;
        var ul = (context.viewType === ViewTypeEnum.location) ? ("#activity-comments-location") : ("#activity-comments-content");
        console.log("getActivity", context);
        for (var i = activities.length - 1; i >= 0 ; i--) {
            //console.log('getActivity for', $(ul + " li:first"));
            let comment = activities[i];
            printActivityComment($(ul + " li:first"), comment, comment.formatDate);
        }
    });

    socket.on("newActivity", function (context) {
        var ul = (context.viewType === ViewTypeEnum.location) ? ("#activity-comments-location") : ("#activity-comments-content");
        console.log("Nouveau commentaire", context);
        printActivityComment($(ul + " li:first"), context.activity, context.activity.formatDate);
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
 * @Param lastComment = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 * @param when Date
 */
function printActivityComment(lastComment, comment, when) {
    addActivity();
    let avatar;
    if (!comment.avatar)
        avatar = '<img data-name="' + comment.author + '" class="col s2 profile"/>';
    else
        avatar = '<img class=\"col s2\" src=\"'+ comment.avatar +'">';

    lastComment.after("<li>" +
        "<div class=\"row\">\n" +
        "    <div class=\"col s12\">\n" +
        "        <div class=\"card\">\n" +
        "            <div class=\"card-content white-text\">\n" +
        "                <div class=\"row\">\n" +
        "                    <div>\n" +
                                    avatar + '\n' +
        "                        <span class=\"card-title s10\"> <span class=\"who\">" + comment.author + "</span> <span class=\"what\">added a comment</span>, <span class=\"when\">" + when + "</span></span>\n" +
        "                    </div>\n" +
        "                    <p class=\"col s12\">"+ comment.content +"</p>" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"card-action row\">\n" +
        "                <div class=\"cache-toi\" style=\"display: none;\">\n" +
        "                    <input class=\"comment-input\"  data-index='" + comment.index + "' onkeydown='addCommentToActivity(event, this)' placeholder=\"Add your comment...\" type=\"text\">\n" +
        "                </div>\n" +
        "                <div class=\"chip comment\" onclick='slideInputComment(this)' data-id='" + comment._id + "'>\n" +
        "                    <span class=\"chip-content\">Comment</span>\n" +
        "                </div>\n" +
        "                <div class=\"chip activity-upload\" onclick='uploadFile()'>\n" +
        "                    <span class=\"chip-content\">Attach a file</span>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>" +
        "</li>");
    $('.profile').initial();
}


/**
 * Upload a file
 */
function uploadFile() {
    $("#activity-uploader").click();
}

/**
 * Slide input comment
 */
function slideInputComment(e) {
    element = $(e);
    console.log("[.comment] onClick", $(element.prev().children()[0]));
    element.prev().slideToggle(function() {
        element.children().trigger("select");
    });
};

/**
 *
 */
function addCommentToActivity(event, elem) {
    if (event.key !== "Enter") return ;
    console.log("AddCommentToActivity");
    var element = $(elem);
    var content = element.val();
    var ul = (view === ViewTypeEnum.location) ? ("#activity-comments-location") : ("#activity-comments-content");
    //console.log("index = ", $(ul).index($(elem)));
    console.log("")
    socket.emit('addCommentToActivity', { nodeId: idOfchoosenNode,  activityIndex: element.attr('data-index'), comment: {content: content, date: new Date()}, viewType: view});
}