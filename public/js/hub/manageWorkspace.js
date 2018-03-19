$(document).ready(function () {
    const manageWorkspaceBtn = $("#manage-workspace-btn");
    const manageWorkspaceDiv = $("#manage-workspace");
    const manageWorkspaceClose = manageWorkspaceDiv.find('#close');
    const secondColumn = $("#second_column");
    const thirdColumn = $("#third_column");
    const thingsChange = $('#modifier-trigger');
    const dataToChange = $('#modifier');
    const manageWorkspaceError = $("#manage-workspace-error");
    const managerPreferences = $('#preferences-options');
    const managerPreferencesInput = managerPreferences.find('input');
    const managerPreferencesLabel = managerPreferences.find('label');
    const visibility = "visibility";
    const hidden = "hidden";

    let workspaceType = 'workspace';
    let organizationType = 'organization';
    let listType = workspaceType;

    $("#manage-workspace").find('li').on('click', () => console.log('l'));

    /**
     * Toggle the manageWorkspace div
     */
    function togglemanageWorkspace(cb) {
        secondColumn.toggle();
        thirdColumn.toggle();
        manageWorkspaceDiv.find('input').val("");
        manageWorkspaceError.css(visibility, hidden);
        manageWorkspaceDiv.toggle(1, cb);
    }

    manageWorkspaceClose.on('click', () => {
        togglemanageWorkspace();
        manageWorkspaceDiv.find('ul').empty();
    });

    //togglemanageWorkspace();

    socket.on('preferences-manager-name', (data) => {
        if (data !== null) {
            const { type, name } = data;
            Materialize.toast('Changement effectué', 1000);
            managerPreferencesInput.attr('placeholder', null);
            if(type == 'organization') $('#workspace-name').text(name); 
        }
    });

    thingsChange.click((event) => {
        event.preventDefault();
        Materialize.toast('Changement en cours', 1000);
        socket.emit('preferences-manager-name');
    })

    socket.on('workspaceManager', (data) => {
        if (data !== null) {
            const { members, owners, isOwner, name } = data;
            managerPreferencesInput.attr('placeholder', name);
            console.log(members.length);
            members.sort((a, b) => a.completeName.localeCompare(b.completeName));
            for (let i = 0; i < members.length; i++) {
                const { completeName, email } = members[i];
                manageWorkspaceDiv.find('ul#users-list').append(getUserHtml(completeName, email, isOwner, owners.find((elem) => elem.email === email)));
            }
            $('.profile').initial();
        }
        manageWorkspaceDiv.find('li.collection-item').on('click', 'a', (event) => {
            const elem = $(event.currentTarget);
            console.log('REMOVE USER:', elem.prev().text());
            socket.emit('removeUserFromOW', { userEmail: elem.prev().text(), command: listType });
            elem.parent().remove();
        });
    });

    socket.on('removeUserFromOW', (state) => console.log('state : ', state));

    manageWorkspaceBtn.on('click', () => {
        togglemanageWorkspace(() => {
            socket.emit('workspaceManager', { type: workspaceType });
        });
    });

    manageWorkspaceDiv.on('click', 'a.collection-item', (event) => {
        manageWorkspaceDiv.find('a.collection-item').removeClass('active');
        const elem = $(event.target);
        elem.addClass('active');
        manageWorkspaceDiv.hide();
        manageWorkspaceDiv.find('ul#users-list').empty();
        manageWorkspaceDiv.show();
        console.log('elem.text: ', elem.text());
        const OptionName = elem.text() + ' Name';

        managerPreferencesInput.attr('placeholder', '');
        managerPreferencesInput.val('');
        managerPreferencesLabel.text(OptionName);

        listType = elem.text().toLowerCase();
        socket.emit('workspaceManager', { type: listType })
    });

    function getUserHtml(completeName, email, currentIsOwner, isOwner, avatar) {
        const imgHtml = getAvatar(avatar, completeName, 'circle');
        const croix = currentIsOwner ? '<a href="#!" class="secondary-content"><i class="material-icons">clear</i></a>' : '';
        const tag = isOwner ? '<div class="chip secondary-content">Owner</div>' : croix;

        return '<li class="collection-item avatar">' +
            imgHtml +
            '<span class="title">' + completeName + '</span>' +
            '<p>' + email + '</p>' +
            tag +
            '</li>';
    }
});