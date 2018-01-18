$(document).ready(function() {
    socket.on(signInFailed, function () {
        $("#signIn-btn").after("<div class='error'>Invalid email or password</div>")
    });

    socket.on(signInSucceed, function (signinInfo) {
        var workspaces = signinInfo.workspaces;
        user = signinInfo.user;
        //console.log("workspaces : ", workspaces);
        var ul = $("ul");
        ul.empty(); // delete all <ul>
        ul.append("<li></li>"); // Add one <li> in order to add the next <li> after it
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

    $("#createWorkspace").on("click", function () {
        hideBox($(workspacesPicker), function () {
            $(disabledNameId).val(user.completeName);
            console.log("ici3");
            $('select').empty();
            for (var i = 0 ; i < user.organizations.length ; i++)
            {
                $('#organizationSelect').append($(document.createElement("option")).
                attr("value", user.organizations[i]._id).text(user.organizations[i].name));
            }
            $("#hiddenEmailWorkspace").val($("#emailSignIn").val());
            $("#hiddenPasswordWorkspace").val($("#passwordSignIn").val());
            showBox($("#workspaceCreationBox"));
        });
    });

    $('#workspaceCreation').submit(function(){
        $("#hiddenOrganizationNameWorkspace").val($(organizationSelect).text());
        return true;
    });
});
