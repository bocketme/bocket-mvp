$(document).ready(function() {
    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";
    var visibility = "display";
    var workspaceBoxId = "#workspaceSignUpBox";
    var already = false;

    signUp(lauchButtonId, boxId);

    $("#userSignUp").on("submit", function(e) {
        e.preventDefault();
        var email = $("#email");
        if ($( "#userSignUp" ).valid())
        {
            checkUniqueField("User", "email", email.val(),
                function () {
                    hideBox($(boxId), function () {
                        $("#hiddenEmail").val(email.val());
                        $("#hiddenPassword").val($("#password").val());
                        showBox($(workspaceBoxId));
                    });
                },
                function () {
                    $("#email").after("<div class='error'>This email is already taken</div>");
                }
            );
        }
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

    $("#workspaceSignUp").on("submit", function(e) {
        if (already)
        {
            already = false;
            return true;
        }
        if ($( "#workspaceSignUp" ).valid())
        {
            e.preventDefault();
            var organizationName = $("#companyName");
            checkUniqueField("Organization", "name", organizationName.val(),
                function () {
                    $("#workspaceSignUp").submit();
                    already = true;
                },
                function () {
                    organizationName.after("<div class='error'>This organization name is already taken</div>");
                }
            );
        }
    });

    $.validator.methods.email = function( value, element ) {
        return this.optional(element) || /[a-z]+@[a-z]+\.[a-z]+/.test(value);
    };

    $.validator.methods.completeName = function (value, element) {
        return this.optional(element) || /[A-Z][a-z]+ [A-Z][a-z]+/.test(value);
    };

    $.validator.addMethod(
        "completeName",
        function(value, element) {
            return this.optional(element) || /[A-Z][a-z]+ [A-Z][a-z]+/.test(value);
        },
        "Please check your input."
    );

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
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        },
    });

    $( "#workspaceSignUp" ).validate({
        rules: {
            completeName: {
                required: true,
                completeName: true,
            },
            companyName: {
                required: true,
            },
            workspaceName: {
                required: true,
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

});
