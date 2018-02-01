$(document).ready(function() {
    var lauchButtonId = "#signUp";
    var boxId = "#userSignUpBox";
    var toReset = "#userSignUp";
    var visibility = "display";
    var workspaceBoxId = "#workspaceSignUpBox";
    var already = false;

    begin(lauchButtonId, boxId, toReset);

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
        hideBox($("#workspaceCreationBox"));
    });

    $("#workspaceSignUp").on("submit", function(e) {
        if (already)
        {
            already = false;
            return true;
        }
        if ($( "#workspaceSignUp" ).valid())
        {
            e.preventDefault();
            console.log("icii");
            var organizationName = $("#companyName");
            checkUniqueField("Organization", "name", organizationName.val(),
                function () {
                    var completeName = $("#completeName");
                    completeName.val(CapitalizeCompleteName(completeName.val()));
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
        return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    };

    $.validator.methods.completeName = function (value, element) {
        return this.optional(element) || /[a-z]+ [a-z]+/.test(value);
    };

    $.validator.addMethod(
        "completeName",
        function(value, element) {
            return this.optional(element) || /[a-zA-z]+ [a-zA-Z]+/.test(value);
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

    $("#login_id").on("click", function () {
        hideBox($(boxId), function () {
            showBox($("#userSignInBox"));
        });
    });

    function CapitalizeCompleteName(completeName) {
        var tmp = completeName.split(" ");

        tmp[0] = tmp[0].toLowerCase();
        tmp[1] = tmp[1].toLowerCase();

        tmp[0] = tmp[0].charAt(0).toUpperCase() + tmp[0].slice(1);
        tmp[1] = tmp[1].charAt(0).toUpperCase() + tmp[1].slice(1);

        return tmp[0] + " " + tmp[1];
    }

});
