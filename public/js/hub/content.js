var activityLocation = $("#activity-comments-location");
var activityContent = $("#activity-comments-content");
var nbrOfActivityLocation = 0;
var nbrOfActivityContent = 0;

function getNbrOfActivity() {
    if (view === ViewTypeEnum.content)
        return nbrOfActivityContent;
    else
        return nbrOfActivityLocation;
}

function addActivity(nbr) {
    if (!nbr) nbr = 1;
    console.log("nbr = ", nbr);
    if (view === ViewTypeEnum.content)
        return nbrOfActivityContent += nbr;
    else
        return nbrOfActivityLocation += nbr;
}

function resetLocation() {
    nbrOfActivityLocation = 0;
}

function resetContent() {
    nbrOfActivityContent = 0;
}

$(document).ready(function () {

   $("div#content").on("click", function () {
       view = ViewTypeEnum.content;
       activityLocation.css("display", "none");
       activityContent.css("display", "block");
   })
});