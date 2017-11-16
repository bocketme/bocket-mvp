var delay = 200;
var visible = "flex";

var blurId = "#blur";

function showBlur(blur) {
    blur.css({
        opacity: 0,
        visibility: "visible"
    }).animate({opacity:0.7}, delay + 250);
}

function hideBlur(blur) {
    blur.animate({opacity:0}, delay + 250, setInvisible);
}

function setInvisible(id) {
    $(blurId).css({visibility : "hidden"});
}

function showBox(box) {
    box.css({
        opacity: 0,
        display: visible
    }).animate({opacity:1}, delay + 250);
}

function hideBox(box, cb) {
    box.delay(delay).fadeOut('slow', cb);
}

function checkUniqueField(modelName, uniqueFieldName, value, NotTakenCb, takenCb) {
    socket.on("uniqueFieldNotUsed", NotTakenCb);
    socket.on("uniqueFieldAlreadyUsed", takenCb);
    socket.emit("checkUniqueField", modelName, uniqueFieldName, value);
};

$(document).ready(function() {
});
