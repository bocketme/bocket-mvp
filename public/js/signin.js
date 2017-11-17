/* ID */
var lauchButtonId = "#signIn";
var boxId = "#userSignInBox";
var userSignIn = "#userSignIn";
var workspacesPickerId = "#workspacesPicker";
var chosenWorkspaceId = "#chosenWorkspace";
var toReset = "#userSignIn";
var workspacesPicker = "#workspacesPickerBox";
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
/* !VARIABLES */

$(document).ready(function() {
    begin(lauchButtonId, boxId, toReset);

    $(".closeBox").click(function() {
        hideBlur($(blurId));
        hideBox($(boxId));
        hideBox($(workspacesPicker));
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

    socket.on(signInFailed, function () {
        $("#signIn-btn").after("<div class='error'>Invalid email or password</div>")
    });

    socket.on(signInSucceed, function (workspaces) {
        //console.log("workspaces : ", workspaces);
        var ul = $("ul");
        /*ul.empty();
        ul.append("<li></li>");*/
        workspaces.forEach(function (workspace) {
            //console.log("je rajoute un W : ", workspace);
            $("#workspacesPicker ul li:last").after('                    <li class="collection-item avatar workspace">' +
                '                        <i class="material-icons circle">folder</i>' +
                '                        <span class="workspace-id">' + workspace._id + '</span>' +
                '                        <span class="title">' + workspace.name + '</span>' +
                '                        <p style="color: lightslategray">' + workspace.organization.name +
                '                        </p>' +
                '                    </li>');
        });
        $(".workspace").on("click", chosenWorkspace);
        $("#emailWorkspace").val($("#emailSignIn").val());
        $("#passwordlWorkspace").val($("#passwordSignIn").val());
        hideBox($(boxId), function () {
            showBox($(workspacesPicker));
        });
    });

    // Change color when a workspace is choose
    function chosenWorkspace(e) {
        var currentTarget = $(e.currentTarget);

        $(".workspace").removeClass(chosenWorkspaceClass);
        currentTarget.addClass(chosenWorkspaceClass);
        $(chosenWorkspaceId).val($("span:first", currentTarget).text());
    }

    $("#userSignIn").on("submit", function(e) {
        e.preventDefault();
        if ($( "#userSignUp" ).valid())
        {
            socket.emit("signin", {email: $("#emailSignIn").val(), password: $("#passwordSignIn").val()});
        }
    });
});
