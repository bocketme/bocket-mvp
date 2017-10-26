var socket = io('http://localhost:8080');

socket.on('connect', function () {
    console.log('Client has connected to the server!');
});

function isTitleNotEmpty(t) {
    if (t.length === 0) {
        document.getElementById('title-error').classList.add("show");
        return false;
    } else {
        document.getElementById('title-error').classList.remove("show");
        return true;
    }
}

function isDescriptionNotEmpty(d) {
    if (d.length === 0) {
        document.getElementById('description-error').classList.add("show");
        return false;
    } else {
        document.getElementById('description-error').classList.remove("show");
        return true;
    }
}

document.getElementById('pl-submitbtn').addEventListener('click', function (e) {
    e.preventDefault();

    var newTitle = document.getElementById('new-title').value;

    if (isTitleNotEmpty(newTitle)) {
        socket.emit('newProject', {
            projectTitle: newTitle,
        });
    }
});