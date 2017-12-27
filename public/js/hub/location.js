// Declared in ./content.js
//var activityLocation = $("#activity-comments-location");
//var activityContent = $("#activity-comments-content");

$(document).ready(function () {

    $("div#location").on("click", function () {
        view = ViewTypeEnum.location;
        activityLocation.css("display", "block");
        activityContent.css("display", "none");
    })
});
