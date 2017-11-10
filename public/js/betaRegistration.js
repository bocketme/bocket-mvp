jQuery(function(){
    $("#beta_button").on("click", function() {
        var email = $("#email_beta").val();
        if (email === "")
            return ;
        socket.emit("betaRegistration", email);
    });

    $("#close").on("click", function() {
        $("#popup1").css("opacity", "0").css("visibility", "hidden");

        $("#blur").css("opacity", "0").css("visibility", "hidden");
    });

    socket.on("betaRegistration", showPopUp);

    socket.on("internalError", showPopUp);

    function showPopUp(ret) {
        var title = ret.title;
        var desc = ret.desc;
        $("#popup1").css("transition", "all 1s ease-in-out");
        $("#popup1").css("visibility", "visible").css("opacity", "1");
        $("#blur").css("transition", "all 1s ease-in-out");
        $("#blur").css("opacity", "0.7").css("visibility", "visible");
        $("#popup-title").text(title);
        $("#popup-desc").text(desc);
    }
});
