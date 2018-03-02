$(document).ready(function () {
  const manageWorkspaceBtn = $("#manage-workspace-btn");
  const manageWorkspaceClose = $("#manage-workspace-close");
  const manageWorkspaceDiv = $("#manage-workspace");
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

  //togglemanageWorkspace();

  socket.on('workspaceManager', (data) => {
    if (data !== null) {
      const { members, owner } = data;
      console.log(members.length);
      for (let i = 0 ; i < members.length ; i++) {
        const { completeName, email } = members[i];
        manageWorkspaceDiv.find('#users-list').append(getUserHtml(completeName, email));
      }
      $('.profile').initial();
      togglemanageWorkspace();
    }
  });


  //togglemanageWorkspace();
  manageWorkspaceBtn.on('click', () => {
    socket.emit('workspaceManager', { type: workspaceType })
  });

  function getUserHtml(completeName, email, avatar) {
    let imgHtml = getAvatar(undefined, completeName, 'circle');
    let html =
        '<li class="collection-item avatar">' +
        imgHtml +
        '<span class="title">' + completeName + '</span>' +
        '<p>' + email + '</p>' +
        '<a href="#!" class="secondary-content"><i class="material-icons">clear</i></a>' +
        '</li>';
    console.log('html:', imgHtml);
    return html;
  }
});
