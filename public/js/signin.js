/* ID */
var lauchButtonId = "#signIn";
var boxId = "#userSignInBox";
var userSignIn = "#userSignIn";
var workspacesPickerId = "#workspacesPicker";
var chosenWorkspaceId = "#chosenWorkspace";
var toReset = "#userSignIn";
var workspacesPicker = "#workspacesPickerBox";
var disabledNameId = "#disabledName";
var disabledOrganizationName = "#disabledOrganizationName";
var organizationSelect = "#organizationSelect";
var changePassword = "#change-password";
/* !ID */

/* CLASS NAME */
var chosenWorkspaceClass = "chosen-workspace";
/* !CLASS NAME */

/* LISTENER NAME */
var signInFailed = "signinFailed";
var signInSucceed = "signinSucced";
/* !LISTENER NAME */

/* VARIABLES */
var visibility = "display";
var already = false;
var user = null;
/* !VARIABLES */

$(document).ready(function() {
    $('select').material_select();

    begin(lauchButtonId, boxId, toReset);

    $(".closeBox").click(function() {
        hideBlur($(blurId));
        hideBox($(boxId));
        hideBox($(workspacesPicker));
        hideBox($(changePassword));
    });

    $(userSignIn).validate({
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

    $(workspacesPickerId).validate({
        ignore: ":hidden:not(#chosenWorkspace)",
        rules: {
            workspaceId: {
                required: true,
            },
        },
        messages:{
          workspaceId: {
              required: "You have to choose a workspace",
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

    $("#create_account").on("click", function () {
        hideBox($(boxId), function () {
            showBox($("#userSignUpBox"));
        });
    });

    socket.on(signInFailed, function () {
        $("#signIn-btn").after("<div class='error'>Invalid email or password</div>")
    });

});
