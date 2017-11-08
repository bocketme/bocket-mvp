jQuery(function() {
    var visibility = "display";
    var hidden = "none";
    var visible = "flex";
    var delay = 200;


    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";

    signUp(lauchButtonId, boxId);

    $.validator.methods.email = function( value, element ) {
        return this.optional( element ) || /[a-z]+@[a-z]+\.[a-z]+/.test( value );
    };

    $( "#userSignUp" ).validate({
        rules: {
            username: {
                required: true,
                minlength: 5
            },
            firstName: {
                required: true,
            },
            lastName: {
                required: true,
            },
            password: {
                required: true,
                minlength: 6,
            },
            cpassword: {
                required: true,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            }
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }    });

    function signUp(lauchButtonId, boxId) {
        var lauchButtonId = lauchButtonId;
        var boxId = boxId;

        var launchButton = $(lauchButtonId);
        var box = $(boxId);
        var blur = $("#blur");

        $(".closeBox").click(function() {
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
