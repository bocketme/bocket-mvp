var newComment = "newActivityComment";

$(document).ready(function() {
    $('.profile').initial();
    var empty = "";
    const $msgArea = $(".message-area");

    $(".activity-upload").on("click", uploadFile);
    $(".comment").on("click", slideInputComment);

 
    $("a[href='#comments']").on("click", function() {   //when click on comments, scrolldown to the input tchat
        $("#comments").css({
            'display':'block',
            'visibility':'visible'
        });    
        $msgArea.animate({ scrollTop: $msgArea.prop("scrollHeight")}, "slow");
    });
    $("a[href='#comments']").trigger("click");


    $(".add-comment-input").keydown(function (e) {
        if (e.which === 13 && $(this).val() !== empty) {
            var ul = (view === ViewTypeEnum.location) ? ("#activity-comments-location") : ("#activity-comments-content");
            addCommentActivity($(ul + " li:first"), {content: $(this).val(), date: new Date}, view);
            $(this).val(empty);
            $msgArea.animate({ scrollTop: $msgArea.prop("scrollHeight")}, "slow");

        }
    });

    /**
     * Get the last activity
     * @param context : {{ viewType : String, activities : [String] }}
     */
    socket.on("getActivities", function (context) {
        console.log("aaaaaaa : ", context);
        var activities = context.activities;
        var ul = "#activity-comments";
        clearComments($(ul));
        for (var i = activities.length - 1; i >= 0 ; i--) {
            let comment = activities[i];
            printActivityComment($(ul + " li:first"), comment, comment.formatDate, context.username);
            if (comment.comments.length !== 0)
                for (var y = 0 ; y < comment.comments.length ; y++ ) {
                    printCommentOfActivity(comment.comments[y], comment.index);
                }
        }
    });

    socket.on("newActivity", function (context) {
        var ul = "#activity-comments";
        console.log("Nouveau commentaire", context);
        printActivityComment($(ul + " li:first"), context.activity, context.activity.formatDate, context.username);
        $msgArea.animate({ scrollTop: $msgArea.prop("scrollHeight")}, "slow");

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

function getAvatar(avatarSrc, author) {
    let avatar;
    if (!avatarSrc)
        avatar = '<img data-name="' + author + '" class="avatar col s2 profile tooltipped" data-tooltip="'+ author +'" data-position="left" data-delay="50"/>';
    else
        avatar = '<img class=\"avatar col s2 tooltipped\" src=\"'+ avatarSrc +'">';
    return avatar
}

/**
 *
 * @Param lastComment = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 * @param when Date
 */
function printActivityComment(lastComment, comment, when, username) {

    let avatar = getAvatar(comment.avatar, comment.author); 
    if (username === comment.author)    {
       $('.message-area')
       .append( `<div class='col s12'>
                    <div class='message-display'>
                        ${comment.content}
                    </div>
                </div>`);
    }
    else {
       $('.message-area').append(`<div class='col s12'> <div class="row message-other">
        ${avatar}
        ${comment.content}
       </div> </div>`);
    }
     $('.tooltipped').tooltip();
     $('.profile').initial();

}

/**
 * print a comment of an activity
 * @param comment : {avatar : String, author : String, date : String, content: String }
 * @param index : String (index of the comment)
 */
function printCommentOfActivity(comment, index) {

    var ulId = (view === ViewTypeEnum.location) ? ("#activity-comments") : ("#activity-comments-content");    
    let avatar = getAvatar(comment.avatar, comment.author);
    $(`${ulId} .comment-input[data-index=${index}]`).parent().prev().append(`
        <li class="commentOfActivity">
        <div class="row">
                ${avatar}
            <div class="col s9">
                <span class="card-title s10"> <span class="who" style="padding-left: 0"> ${comment.author} </span><br></span>${comment.content}</span>
            </div>
        </div>
        </li>`);
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
    element.prev().prev().slideToggle(function() {
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
   // console.log(content);
    socket.emit('addCommentToActivity', { nodeId: idOfchoosenNode,  activityIndex: element.attr('data-index'), comment: {content: content, date: new Date()}, viewType: view});
}


/*.prepend("<div>\n" +
    "avatar" + '\n' +
    "<span class=\"card-title s10\"> <span class=\"who\">" + comment.author + "</span>, <span class=\"when\">" + comment.date + "<br></span></span>\n" +
    "</div>\n" +
)*/

/**
 * Add a new comment of the context activity
 */
socket.on("newActivityComment", function (data) {
    var nodeId = data.nodeId;
    var comment = data.comment;
    if (nodeId && comment) {
        console.log("newActivityComment = ", data, nodeId, comment)
        printCommentOfActivity(comment, comment.index);
    } else {
        console.log("Error on newAcivityComment");
    }
});
