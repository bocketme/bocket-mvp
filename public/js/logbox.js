jQuery(function() {

    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";

    var launchButton = $(lauchButtonId);
    var box = $(boxId);

    var visibility = "display";
    var hidden = "none";
    var visible = "flex";

    var delay = 200;

    $("#closeBox").click(function() {
        console.log("close");
        box.delay(delay).fadeOut('slow');
    });

    launchButton.click(function() {
        console.log(box.css(visibility));
        if (box.css(visibility) === visible)
        {
            box.delay(delay).fadeOut('slow');
            console.log("if");
        }
        else
        {
            $("#userSignUp").get(0).reset();
            $("input").val('');
            box.css({
                opacity: 0,
                display: visible
            }).animate({opacity:1}, delay + 250);
            console.log("else");
        }
    });
});