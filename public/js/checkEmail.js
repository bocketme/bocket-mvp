jQuery(function() {
    console.log("CheckEmail.js");

    function checkIfEmailAlreadyExist(email, cb) {
        socket.on("checkIfEmailAlreadyExist", cb);
        socket.emit("checkIfEmailAlreadyExist", email);
        cb();
    }
  $("#email").focusout(function () {
    });
});
