$(document).ready(function () {
  const manageWorkspaceBtn = $("#manage-workspace-btn");
  const manageWorkspaceDiv = $("#manage-workspace");
  const manageWorkspaceClose = manageWorkspaceDiv.find('#close');
  const secondColumn = $("#second_column");
  const thirdColumn = $("#third_column");
  const manageWorkspaceError = $("#manage-workspace-error");

  const visibility = "visibility";
  const hidden = "hidden";

  let workspaceType = 'workspace';
  let organizationType = 'organization';
  let listType = workspaceType;

  /**
   * Toggle the manageWorkspace div
   */
  function togglemanageWorkspace() {
    secondColumn.toggle();
    thirdColumn.toggle();
    manageWorkspaceDiv.find('input').val("");
    manageWorkspaceError.css(visibility, hidden);
    manageWorkspaceDiv.toggle();
  }

  manageWorkspaceClose.on('click', () => {
    togglemanageWorkspace();
    manageWorkspaceDiv.find('ul').empty();
  });

  //togglemanageWorkspace();

  socket.on('workspaceManager', (data) => {
    if (data !== null) {
      const { members, owners } = data;
      console.log(members.length);
      members.sort((a, b) => a.completeName.localeCompare(b.completeName));
      for (let i = 0 ; i < members.length ; i++) {
        const { completeName, email } = members[i];
        manageWorkspaceDiv.find('ul#users-list').append(getUserHtml(completeName, email, owners.find((elem) => elem.email === email)));
      }
      $('.profile').initial();
    }
  });

  manageWorkspaceBtn.on('click', () => {
    socket.emit('workspaceManager', { type: workspaceType });
    togglemanageWorkspace();
  });

  manageWorkspaceDiv.on('click', 'a.collection-item', (event) => {
    manageWorkspaceDiv.find('a.collection-item').removeClass('active');
    const elem = $(event.target);
    elem.addClass('active');
    manageWorkspaceDiv.find('ul#users-list').empty();
    console.log('elem.text: ', elem.text());
    socket.emit('workspaceManager', { type: elem.text().toLowerCase() })
  });

  function getUserHtml(completeName, email, isOwner, avatar) {
    const imgHtml = getAvatar(avatar, completeName, 'circle');
    const tag = isOwner ? '<div class="chip secondary-content">Owner</div>' : '<a href="#!" class="secondary-content"><i class="material-icons">clear</i></a>';

    return '<li class="collection-item avatar">' +
        imgHtml +
        '<span class="title">' + completeName + '</span>' +
        '<p>' + email + '</p>' +
        tag +
        '</li>';
  }
});
