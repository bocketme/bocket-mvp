const deleteAUser = $('#delete-from-workspace');
deleteAUser.on('click', () => {
  if (rights > 4)
    $('#').modal('open');
  else
    Materialize.toast('You have no rights to delete a user from the workspace');
});

const changeWorkspaceName = $('#workspace_name');
const submitNewWorkspaces = $('#new-workspace-submit');
const selectProductManager = $('select[name=productManager]');
changeWorkspaceName.on('input', () => {
  const inputVal = changeWorkspaceName.val(),
    selection = selectProductManager.val();
  if (inputVal !== '' && selection !== null) {
    submitNewWorkspaces.removeClass('disabled');
    submitNewWorkspaces.css('background-color', '#00cca0');
  } else {
    submitNewWorkspaces.addClass('disabled');
    submitNewWorkspaces.css('background-color', '#DFDFDF');
  }
});

$(document).on('addNews', (event, type, method, target, role, workspaceId) => {
  const news = {
    type,
    content: {
      method,
      target,
      role,
    },
  };
  socket.emit('[Newsfeed] - addFromWorkspace', news, workspaceId);
});

$(document).on('change', 'select[name=workspaceManager]', function (event) {
  const selection = $(this);
  const role = selection.val(),
    userId = selection.attr('userId'),
    workspaceId = selection.attr('workspaceId');
  socket.emit('[Workspace] - changeRoles', workspaceId, userId, role);
});

function removeWorkspaceUser(workspaceId, userId) {
  Materialize.toast('Ongoing deletion', 1000);
  $(document).trigger('addNews', ['USER', 'DELETE', { _id: userId, name: '' }, '', workspaceId]);
  socket.emit('[Workspace] - remove', workspaceId, userId);
}

socket.on('[Workspace] - changeRoles', (err, html, workspaceId) => {
  if (err) Materialize.toast(err);
  else {
    const divWorkspace = $(`#workspace-${workspaceId}`);
    divWorkspace.html('');
    divWorkspace.html(html);
    $('select').material_select();
  }
});

socket.on('[Workspace] - remove', (err, html, workspaceId) => {
  if (err) Materialize.toast(err);
  else {
    const divWorkspace = $(`#workspace-${workspaceId}`);
    divWorkspace.html('');
    divWorkspace.html(html);
    $('select').material_select();
  }
});

selectProductManager.on('change', () => {
  const inputVal = changeWorkspaceName.val(),
    selection = selectProductManager.val();
  if (inputVal !== '' && selection !== '') {
    submitNewWorkspaces.removeClass('disabled');
    submitNewWorkspaces.css('background-color', '#00cca0');
  } else {
    submitNewWorkspaces.addClass('disabled');
    submitNewWorkspaces.css('background-color', '#DFDFDF');
  }
});


const deleteFromWorkspace = (rights, isProductManager) => {
  if (rights > 4 || isProductManager) {
    $('#').modal('open');
  } else
    Materialize.Toast('You have no rights to delete the organization');
};

const leaveWorkspace = (rights, isProductManager) => {
  $('#').modal('open');
};
