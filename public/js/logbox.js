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
}
function begin(lauchButtonId, boxId, toResetId) {
    var lauchButtonId = lauchButtonId;
    var boxId = boxId;

    var launchButton = $(lauchButtonId);
    var box = $(boxId);
    var blur = $(blurId);
    var toReset = $(toResetId);

    launchButton.click(function() {
        console.log(box.css("visibility"));
        if (box.css("visibility") === visible)
        {
            hideBox(box);
            hideBlur(blur);
        }
        else
        {
            showBlur(blur);
            toReset.get(0).reset();
            $("input").val('');
            showBox(box);
        }
    });
}

$(document).ready(function() {
});
