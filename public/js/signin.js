var lauchButtonId = "#signIn";
var boxId = "#userSignInBox";
var workspacesPicker = "#workspacesPickerBox";
var toReset = "#userSignIn";
var visibility = "display";
var already = false;

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
        console.log("workspaces : ", workspaces);
        $("ul").empty();
        $("ul").append("<li></li>");
        workspaces.forEach(function (workspace) {
            console.log("je rajoute un W");
            $("#workspacesPicker ul li:last").after('                    <li class="collection-item avatar">' +
                '                        <i class="material-icons circle">folder</i>' +
                '                        <span class="title">' + workspace.name + '</span>' +
                '                        <p style="color: lightslategray">First Line <br>' +
                '                            Second Line' +
                '                        </p>' +
                '                    </li>');
        });
        hideBox($(boxId), function () {
            showBox($(workspacesPicker));
        });
    });

    $("#userSignIn").on("submit", function(e) {
        e.preventDefault();
        if ($( "#userSignUp" ).valid())
        {
            socket.emit("signin", {email: $("#emailSignIn").val(), password: $("#passwordSignIn").val()});
        }
    });

});
