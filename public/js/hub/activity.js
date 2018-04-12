const newComment = 'newActivityComment';

$(document).ready(() => {
  $('.profile').initial();
  const empty = '';
  const $msgArea = $('.message-area');

  $('.activity-upload').on('click', uploadFile);
  $('.comment').on('click', slideInputComment);


  $("a[href='#comments']").on('click', () => { // when click on comments, scrolldown to the input tchat
    $('#comments').css({
      display: 'block',
      visibility: 'visible',
    });
    $msgArea.animate({ scrollTop: $msgArea.prop('scrollHeight') }, 'slow');
  });
  $("a[href='#comments']").trigger('click');


  $('.add-comment-input').keydown(function (e) {
    if (e.which === 13 && $(this).val() !== empty) {
      const ul = (view === ViewTypeEnum.location) ? ('#activity-comments-location') : ('#activity-comments-content');
      addCommentActivity($(`${ul} li:first`), { content: $(this).val(), date: new Date() }, view);
      $(this).val(empty);
      $msgArea.animate({ scrollTop: $msgArea.prop('scrollHeight') }, 'slow');
    }
  });

  /**
     * Get the last activity
     * @param context : {{ viewType : String, activities : [String] }}
     */
  socket.on('getActivities', (context) => {
    console.log('aaaaaaa : ', context);
    const activities = context.activities;
    const ul = '#activity-comments';
    clearComments($(ul));
    for (let i = activities.length - 1; i >= 0; i--) {
      const comment = activities[i];
      printActivityComment($(`${ul} li:first`), comment, comment.formatDate, context.username);
      if (comment.comments.length !== 0) {
        for (let y = 0; y < comment.comments.length; y++) {
          printCommentOfActivity(comment.comments[y], comment.index);
        }
      }
    }
  });

  socket.on('newActivity', (context) => {
    const ul = '#activity-comments';
    console.log('Nouveau commentaire', context);
    printActivityComment($(`${ul} li:first`), context.activity, context.activity.formatDate, context.username);
    //  $msgArea.animate({ scrollTop: $msgArea.prop("scrollHeight")}, "slow");
  });
});

/**
 * Clear the comments
 * @Param ulCollection : JqueryElement
 */
function clearComments(ulCollection) {
  const liArray = ulCollection.children();

  for (let i = 1; i < liArray.length; i++) {
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
  socket.emit(newComment, { nodeId: idOfchoosenNode, comment, viewType: view });
}

function getAvatarForActivity(avatarSrc, author) {
  let avatar;
  if (!avatarSrc) { avatar = `<img data-name="${author}" class="avatar col s2 profile tooltipped" data-tooltip="${author}" data-position="left" data-delay="50"/>`; } else { avatar = `<img class=\"avatar col s2 tooltipped\" src=\"${avatarSrc}">`; }
  return avatar;
}

/**
 *
 * @Param lastComment = Jquery on lastComment
 * @Param comment = { author : string, content : string, date: Date }
 * @param when Date
 */
function printActivityComment(lastComment, comment, when, username) {
  const avatar = getAvatarForActivity(comment.avatar, comment.author);
  if (username === comment.author) {
    $('.message-area')
      .append(`<div class='col s12'>
                    <div class='message-display tooltipped' data-tooltip=${when} data-position="left" data-delay="50"'>
                        ${comment.content}
                    </div>
                </div>`);
  } else {
    $('.message-area').append(`<div class='col s12'><div class='row message-other tooltipped' data-tooltip=${when} data-position="right" data-delay="50"'>
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
  const ulId = (view === ViewTypeEnum.location) ? ('#activity-comments') : ('#activity-comments-content');
  const avatar = getAvatarForActivity(comment.avatar, comment.author);
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
  $('#activity-uploader').click();
}

/**
 * Slide input comment
 */
function slideInputComment(e) {
  element = $(e);
  console.log('[.comment] onClick', $(element.prev().children()[0]));
  element.prev().slideToggle(() => {
    element.children().trigger('select');
  });
  element.prev().prev().slideToggle(() => {
    element.children().trigger('select');
  });
}

/**
 *
 */
function addCommentToActivity(event, elem) {
  if (event.key !== 'Enter') return;
  console.log('AddCommentToActivity');
  const element = $(elem);
  const content = element.val();
  const ul = (view === ViewTypeEnum.location) ? ('#activity-comments-location') : ('#activity-comments-content');
  // console.log("index = ", $(ul).index($(elem)));
  // console.log(content);
  socket.emit('addCommentToActivity', {
    nodeId: idOfchoosenNode, activityIndex: element.attr('data-index'), comment: { content, date: new Date() }, viewType: view,
  });
}


/* .prepend("<div>\n" +
    "avatar" + '\n' +
    "<span class=\"card-title s10\"> <span class=\"who\">" + comment.author + "</span>, <span class=\"when\">" + comment.date + "<br></span></span>\n" +
    "</div>\n" +
) */

/**
 * Add a new comment of the context activity
 */
socket.on('newActivityComment', (data) => {
  const nodeId = data.nodeId;
  const comment = data.comment;
  if (nodeId && comment) {
    console.log('newActivityComment = ', data, nodeId, comment);
    printCommentOfActivity(comment, comment.index);
  } else {
    console.log('Error on newAcivityComment');
  }
});
