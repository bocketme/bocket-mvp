$(document).on('ready', function (event) {
  const workspaceDeleteReq = new XMLHttpRequest();

  $("#confirm-workspace-delete").modal({
    ready: (modal, trigger) => {
      workspaceDeleteReq.onreadystatechange = function (event) {
        if (this.readyState === 4) {
          if (this.status === 200) {
            socket.emit("reload", $(trigger).attr('workspaceId'));
            Materialize.toast(`Workspace Deleted`, 500);
            setTimeout(document.location.reload(true), 500)
          } else
            Materialize.toast(`Cannot delete the workspace`, 1000);
        }
      }
      $("#workspaceIdDelete").val($(trigger).attr('workspaceId'));
    }
  })

  $(document).on('click', '#delete-the-workspace', () => {
    const workspaceId = $('#workspaceIdDelete').val();
  
    function deleteWorkspace(workspaceId) {
      workspaceDeleteReq.open("DELETE", `/workspace/${workspaceId}`);
      workspaceDeleteReq.send(null);
    }
  
    deleteWorkspace(workspaceId);
  
  });
});
