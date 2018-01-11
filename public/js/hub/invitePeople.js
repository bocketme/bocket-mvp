$(document).ready(function () {
    const invitePeopleBtn = $("#invite-people-btn");
    const invitePeopleDiv = $("#invite-people-div");
    const secondColumn = $("#second_column");
    const thirdColumn = $("#third_column");

    const display = "display";
    const block = "block";
    const none = "none";

    var invitePeopleActivated = false;

    toggleInvitePeople();
    invitePeopleBtn.on("click", function () {
        toggleInvitePeople();
    });

    function toggleInvitePeople() {
        secondColumn.toggle();
        thirdColumn.toggle();
        invitePeopleDiv.toggle();
    }
});
