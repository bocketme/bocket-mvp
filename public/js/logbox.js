jQuery(function() {
    var visibility = "display";
    var hidden = "none";
    var visible = "flex";
    var delay = 200;


    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";

    signUp(lauchButtonId, boxId);

    $("submit-btn").click(function () {
        console.log("submit");
    });

    function signUp(lauchButtonId, boxId) {
        var lauchButtonId = lauchButtonId;
        var boxId = boxId;

        var launchButton = $(lauchButtonId);
        var box = $(boxId);
        var blur = $("#blur");

        $("#closeBox").click(function() {
            console.log("close");
            hideBox(box);
            blur.css("opacity", "0").css("visibility", "hidden");
        });

        launchButton.click(function() {
            console.log(box.css(visibility));
            if (box.css(visibility) === visible)
            {
                hideBox(box);
                blur.css("opacity", "0").css("visibility", "hidden");
            }
            else
            {
                blur.css("opacity", "0.7").css("visibility", "visible");
                $("#userSignUp").get(0).reset();
                $("input").val('');
                showBox(box);
            }
        });
    }

    function showBox(box) {
        console.log("icioiiio");
        box.css({
            opacity: 0,
            display: visible
        }).animate({opacity:1}, delay + 250);
    }

    function hideBox(box) {
        box.delay(delay).fadeOut('slow');
    }

});
