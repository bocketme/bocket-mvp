$(document).ready(function () {
    $("#userSignIn").on("submit", function(e) {
        e.preventDefault();
        if ($( "#userSignUp" ).valid())
            socket.emit("signin", {email: $("#emailSignIn").val(), password: $("#passwordSignIn").val(), invitationUid: invitationUid});
    });

    socket.on(signInSucceed, function (signinInfo) {
        console.log("SIGNIN SUCCEED");
        $("#vincent").attr("action", "/project/" + signinInfo).submit();
        /*
        $("#emailWorkspace").val($("#emailSignIn").val());
        $("#passwordlWorkspace").val($("#passwordSignIn").val());
        $("#invitationUidWorkspacePicker").val(invitationUid);
        $("#signIn-btn-picker").click();
        */
    });
});
