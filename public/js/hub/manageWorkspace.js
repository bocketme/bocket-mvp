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
    manageWorkspaceDiv.find('li.collection-item').on('click', 'a', (event) => {
      const elem = $(event.currentTarget);
      console.log('REMOVE USER:', elem.prev().text());
      socket.emit('removeUserFromOW', { userEmail: elem.prev().text(), command: listType });
      elem.remove();
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
    manageWorkspaceDiv.find('ul#users-list').empty();
    console.log('elem.text: ', elem.text());
    listType = elem.text().toLowerCase();
    socket.emit('workspaceManager', { type: listType })
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
