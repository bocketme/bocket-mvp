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

    socket.on("betaRegistration", function (ret) {
        var title = ret.title;
        var desc = ret.desc;
        console.log(title, desc);
        $("#popup1").css("visibility", "visible").css("opacity", "1");
        $("#blur").css("opacity", "0.7").css("visibility", "visible");
        $("#popup-title").text(title);
        $("#popup-desc").text(desc);
    });

});
