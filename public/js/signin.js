var lauchButtonId = "#signIn";
//var boxId = "#userSignInBox";
var boxId = "#workplacesPickerBox";
var toReset = "#userSignIn";
var visibility = "display";
var already = false;

$(document).ready(function() {
    begin(lauchButtonId, boxId, toReset);

    $()

    $(".closeBox").click(function() {
        hideBlur($(blurId));
        hideBox($(boxId));
        hideBox($(workspaceBoxId));
    });

    $( "#userSignIn" ).validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6,
            },
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        },
    });

    socket.on("signinFailed", function () {
        $("#signIn-btn").after("<div class='error'>Invalid email or password</div>")
    });

    socket.on("signinSucced", function () {
        $("#signIn-btn").after("<div style='color=greenyellow;'>Valid email or password</div>")
    });

    $("#userSignIn").on("submit", function(e) {
        e.preventDefault();
        socket.emit("signin", {email: $("#emailSignIn").val(), password: $("#passwordSignIn").val()});
    });

});
