var socket = io('http://localhost:8080');

socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

function isContentNotEmpty(c) {
    if (c.length === 0) {
        document.getElementById('comment-empty').classList.add("show");
        return false;
    } else {
        document.getElementById('comment-empty').classList.remove("show");
        return true;
    }
}

document.getElementById('pl-comment-button').addEventListener('click', function (e) {
    e.preventDefault();

    var location = window.location;

    var commentContent = document.getElementById('comment-area').value;

    if (isContentNotEmpty(commentContent)) {
        socket.emit('newPullRequestComment', {
            commentElementId: getCommentId(),
            commentContent: commentContent,
            commentAuthor: 1, //TODO: Change with current user connected
            commentDateOfPublish: "2017-09-21" //Change with Date.now();
        });
        location.reload();
    }
});