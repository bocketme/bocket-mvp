$(document).ready(function () {
    var invitePeopleBtn = $("#invite-people-btn");
    var invitePeopleClose = $("#invite-people-close");
    var invitePeopleDiv = $("#invite-people-div");
    var secondColumn = $("#second_column");
    var thirdColumn = $("#third_column");
    var invitePeopleError = $("#invite-people-error");

    const visibility = "visibility";
    const hidden = "hidden";
    const visible = "visible";

    invitePeopleBtn.on("click", toggleInvitePeople);
    invitePeopleClose.on("click", toggleInvitePeople);

    /**
     * Toggle the invitePeople div
     */
    function toggleInvitePeople() {
        secondColumn.toggle();
        thirdColumn.toggle();
        invitePeopleDiv.find('input').val("");
        invitePeopleError.css(visibility, hidden);
        invitePeopleDiv.toggle();
    }

    /**
     * Email Regex
     * @param email : {string}
     * @returns {boolean}
     */
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }


    /**
     * Called when an user submit the form
     */
    $("#invite-people-submit").on("click", function () {
        var invitePeopleInputs = $("#invite-people-form").find("input");
        var people = [];
        for (var i = 0 ; i < invitePeopleInputs.length ; i++) {
            if (invitePeopleInputs[i].attributes.type.value === 'email' && (invitePeopleInputs[i].value !== '' && validateEmail(invitePeopleInputs[i].value)))
                people.push({email : invitePeopleInputs[i].value, completeName : invitePeopleInputs[i + 1].value});
        }
        if (people.length > 0) {
            console.log(people);
            socket.emit("invitePeople", people);
            toggleInvitePeople();
        } else
            invitePeopleError.css(visibility, visible);
        return false; //prevent form default event
    });
});
