$(document).ready(function() {
    $('#newOrgnanizationName').hide();

    socket.on(signInSucceed, function (signinInfo) {
        var workspaces = signinInfo.workspaces;
        user = signinInfo.user;
        orga = signinInfo.organization;
        //console.log("workspaces : ", workspaces);
        var ul = $("ul");
        $(".organizationOption").remove();
        ul.empty(); // delete all <ul>
        ul.append("<li></li>"); // Add one <li> in order toh add the next <li> after it
        workspaces.forEach((workspace) => {
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
            console.log("ici3 \n", orga);
            let selector = document.getElementById('organizationSelect');
            for (var i = 0 ; i < orga.length ; i++)
            {
                let option = document.createElement("option");
                option.innerHTML = orga[i].name;
                option.setAttribute("class", "organizationOption");
                option.setAttribute("value", orga[i]._id);
                selector.appendChild(option);
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



    $('#workspaceCreation :checkbox').change(function() {
        if (this.checked) {
            $('#organizationSelect').hide();
            $('#organizationSelect').attr('disabled',true).removeClass('disabled');

            $('#newOrgnanizationName').show();
            $('#newOrgnanizationName').attr('disabled',false).toggleClass('disabled');
        } else {
            $('#organizationSelect').show();
            $('#organizationSelect').attr('disabled',false).toggleClass('disabled');

            $('#newOrgnanizationName').hide();
            $('#newOrgnanizationName').attr('disabled',true).removeClass('disabled');
        }
    });
});
