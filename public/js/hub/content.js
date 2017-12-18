var activityLocation = $("#activity-comments-location");
var activityContent = $("#activity-comments-content");
$(document).ready(function () {

   $("div#content").on("click", function () {
       view = ViewTypeEnum.content;
       activityLocation.css("display", "none");
       activityContent.css("display", "block");
   })
});