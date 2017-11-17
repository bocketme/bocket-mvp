var lauchButtonId = "#signIn";
var boxId = "#userSignInBox";
var workspacesPicker = "#workspacesPickerBox";
var toReset = "#userSignIn";
var visibility = "display";
var already = false;
var workspacesInformation = [];

$(document).ready(function() {
    begin(lauchButtonId, boxId, toReset);

    $(".closeBox").click(function() {
        hideBlur($(blurId));
        hideBox($(boxId));
        hideBox($(workspacesPicker));
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

    socket.on("signinSucced", function (workspaces) {
        //console.log("workspaces : ", workspaces);
        var ul = $("ul");
        /*ul.empty();
        ul.append("<li></li>");*/
        workspaces.forEach(function (workspace) {
            //console.log("je rajoute un W : ", workspace);
            $("#workspacesPicker ul li:last").after('                    <li class="collection-item avatar workspace">' +
                '                        <i class="material-icons circle">folder</i>' +
                '                        <span class="title">' + workspace.name + '</span>' +
                '                        <p style="color: lightslategray">' + workspace.organization.name +
                '                        </p>' +
                '                        <span class="workspace-id">' + workspace._id + '</span>' +
                '                    </li>');
        });
        $(".workspace").on("click", chosenWorkspace);
        hideBox($(boxId), function () {
            showBox($(workspacesPicker));
        });
    });

    // Change color when a workspace is choose
    function chosenWorkspace(e) {
        $(".workspace").removeClass("chosen-workspace");
        $(e.currentTarget).addClass("chosen-workspace");
    }

    $("#userSignIn").on("submit", function(e) {
        e.preventDefault();
        if ($( "#userSignUp" ).valid())
        {
            socket.emit("signin", {email: $("#emailSignIn").val(), password: $("#passwordSignIn").val()});
        }
    });

});
