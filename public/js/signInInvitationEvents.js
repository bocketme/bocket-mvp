$(document).ready(function () {
  $("#userSignIn").on("submit", function (e) {
    e.preventDefault();
    if ($("#userSignUp").valid())
      socket.emit("signin", { email: $("#emailSignIn").val(), password: $("#passwordSignIn").val(), invitationUid: invitationUid });
  });

  socket.on(signInSucceed, (signinInfo) => window.location.replace(signinInfo));
});
