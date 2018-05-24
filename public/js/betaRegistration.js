jQuery(function(){
    $("#beta_button").on("click", function() {
        var email = $("#email_beta").val();
        if (email === "")
            return ;
        socket.emit("betaRegistration", email);
    });

    socket.on("betaRegistration", showPopUp);

    socket.on("internalError", showPopUp);

    function showPopUp(ret) {
        var desc = ret.desc;

        if (desc === 'Please, try again.')
            Materialize.toast('Invalid Email', 4000, 'rounded red')
        else
            Materialize.toast('Thank you for your interest ! we will keep you in touch very soon', 4000, 'rounded');
    }
});
