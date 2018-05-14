const deleteAUser = $('#delete-from-workspace');
deleteAUser.on('click', () => {
  if (rights > 4 || isProductManager)
    $('#').modal('open');
  else
    Materialize.toast('You have no rights to delete a user from the workspace')
});

const leaveTheWorkspace = $('#leave-the-workspace');
leaveTheWorkspace.on('click', () => {
  if (rights > 4 || isProductManager)
    $('#').modal('open');
  else
    Materialize.toast('You have no rights to delete a user from the workspace')
});

const changeWorkspaceName = $('#workspace_name');
const submitNewWorkspaces = $('#new-workspace-submit')
const selectProductManager = $('select[name=workspaceManager]');
changeWorkspaceName.on('input', () => {
  const inputVal = changeWorkspaceName.val(), 
  selection = selectProductManager.val();
  if (inputVal !== "" && selection !== null) {
    submitNewWorkspaces.removeClass('disabled');
    submitNewWorkspaces.css('background-color', '#00cca0')
  }  else {
    submitNewWorkspaces.addClass('disabled');
    submitNewWorkspaces.css('background-color', '#DFDFDF')
  }
});

selectProductManager.on('change', () => {
  const inputVal = changeWorkspaceName.val(), 
  selection = selectProductManager.val();
  console.log(selection);
  if (inputVal !== "" && selection !== "") {
    submitNewWorkspaces.removeClass('disabled');
    submitNewWorkspaces.css('background-color', '#00cca0')
  }  else {
    submitNewWorkspaces.addClass('disabled');
    submitNewWorkspaces.css('background-color', '#DFDFDF')
  }
})


const deleteFromWorkspace = (rights, isProductManager) => {
  if (rights > 4 || isProductManager) {
    $('#').modal('open')
  } else
    Materialize.Toast('You have no rights to delete the organization');
};

const leaveWorkspace = (rights, isProductManager) => {
  $('#').modal('open');
};
