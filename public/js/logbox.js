jQuery(function() {
    var visibility = "display";
    var hidden = "none";
    var visible = "flex";
    var delay = 200;


    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";
    var workspaceBoxId = "#workspaceSignUpBox";
    var blurId = "#blur";

    signUp(lauchButtonId, boxId);

    $("#userSignUp").on("submit", function(e) {
        if ($( "#userSignUp" ).valid())
        {
            console.log("FORM VALIDE");
            hideBox($(boxId), function () {
                showBox($(workspaceBoxId));
            });
        }
        else
            console.log("FORM PAS VALIDE");
        e.preventDefault();
    });

    $.validator.methods.email = function( value, element ) {
        return this.optional( element ) || /[a-z]+@[a-z]+\.[a-z]+/.test( value );
    };

    $( "#userSignUp" ).validate({
        rules: {
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
        },
    });

    $( "#workspaceSignUp" ).validate({
        rules: {
            completeName: {
                required: true,
            },
            companyName: {
                required: true,
                minlength: 6,
            },
            workspaceName: {
                required: true,
                minlength: 6,
            },
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        },
    });

    $(".closeBox").click(function() {
        hideBlur($(blurId));
        hideBox($(boxId));
        hideBox($(workspaceBoxId));
    });

    function signUp(lauchButtonId, boxId) {
        var lauchButtonId = lauchButtonId;
        var boxId = boxId;

        var launchButton = $(lauchButtonId);
        var box = $(boxId);
        var blur = $(blurId);

        launchButton.click(function() {
            console.log(box.css(visibility));
            if (box.css(visibility) === visible)
            {
                hideBox(box);
                hideBlur(blur);
            }
            else
            {
                showBlur(blur);
                $("#userSignUp").get(0).reset();
                $("input").val('');
                showBox(box);
            }
        });
    }

    function showBlur(blur) {
        blur.css({
            opacity: 0,
            visibility: "visible"
        }).animate({opacity:0.7}, delay + 250);
    }

    function hideBlur(blur) {
        blur.animate({opacity:0}, delay + 250, setInvisible);
    }

    function setInvisible(id) {
        $(blurId).css({visibility : "hidden"});
    }

    function showBox(box) {
        console.log("icioiiio");
        box.css({
            opacity: 0,
            display: visible
        }).animate({opacity:1}, delay + 250);
    }

    function hideBox(box, cb) {
        box.delay(delay).fadeOut('slow', cb);
    }
});
