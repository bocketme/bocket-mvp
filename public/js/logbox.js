jQuery(function() {

    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";

    var launchButton = $(lauchButtonId);
    var box = $(boxId);

    var visibility = "display";
    var hidden = "none";
    var visible = "flex";

    $("#closeBox").click(function() {
        console.log("close");
        box.delay(250).fadeOut('slow');
    });

    launchButton.click(function() {
        console.log(box.css(visibility));
        if (box.css(visibility) === visible)
        {
            box.delay(250).fadeOut('slow');
            console.log("if");
        }
        else
        {
            $("#userSignUp").get(0).reset();
            $("input").val('');
            box.delay(250).fadeIn('slow');
            console.log("else");
        }
    });
});