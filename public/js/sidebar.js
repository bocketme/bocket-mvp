var socket = io('http://localhost:8080');
console.log('location:', window.location);

$(function() {
    $("#div-comments").scrollTop($("#div-comments")[0].scrollHeight);
});

document.getElementById("pl-comment-button").addEventListener("click", function(event) {
    console.log('click pl-comment-button');
    var date = new Date();
    var splitLocation = window.location.pathname.split('/');

    if (document.getElementById('comment-area').value === '')
    {
        console.log('content :' + document.getElementById('comment-area').value);
        $("#comment-empty").css("display","block");
    }
    else
        $("#comment-empty").css("display","none");

   socket.emit('newNodeComment', {
       commentContent: document.getElementById('comment-area').value,
       commentDateOfPublish: '' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay(),
       commentElementId: splitLocation[splitLocation.length - 1],
    });
    document.getElementById('comment-area').value = ''
});


socket.on('addComment', (data) => {
    $(function() {
        $('#div-comments').append('<div class="speech-bubble">\n' +
            '<p>'+ data.username +'</p>\n' +
            '<p>' + data.comment + '</p>\n' +
            '</div>\n');
        $("#div-comments").scrollTop($("#div-comments")[0].scrollHeight);
    });
});
