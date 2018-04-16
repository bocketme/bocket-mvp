const activityLocation = $('#activity-comments-location');
const activityContent = $('#activity-comments-content');
let nbrOfActivityLocation = 0;
let nbrOfActivityContent = 0;

function getNbrOfActivity() {
  if (view === ViewTypeEnum.content) { return nbrOfActivityContent; }
  return nbrOfActivityLocation;
}

function addActivity(nbr) {
  if (!nbr) nbr = 1;
  // console.log("nbr = ", nbr);
  if (view === ViewTypeEnum.content) { return nbrOfActivityContent += nbr; }
  return nbrOfActivityLocation += nbr;
}

function resetLocation() {
  nbrOfActivityLocation = 0;
}

function resetContent() {
  nbrOfActivityContent = 0;
}

$(document).ready(() => {
  $('div#content').on('click', () => {
    view = ViewTypeEnum.content;
    activityLocation.css('display', 'none');
    activityContent.css('display', 'block');
  });
});
