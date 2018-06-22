$(document).on('ready', function (event) {
  const workspaceDeleteReq = new XMLHttpRequest();

  $("#confirm-workspace-delete").modal({
    ready: (modal, trigger) => {
      workspaceDeleteReq.onreadystatechange = function (event) {
        if (this.readyState === 4) {
          if (this.status === 200) {
            socket.emit("[USER] - reload Workspace", $(trigger).attr('workspaceId'));
            Materialize.toast(`Workspace Deleted`, 500);
            setTimeout(document.location.reload(true), 500)
          } else
            Materialize.toast(`Cannot delete the workspace`, 1000);
        }
      };
      $("#workspaceIdDelete").val($(trigger).attr('workspaceId'));
    }
  });

  function nonAccess() {
    setImmediate(() => {
      Materialize.toast('You can no longer access to this workspace, the page will reload')
      //TODO: Catch another href or make another thing
      document.location.reload(true);
    }, 500);
  }

  $("#leave-the-workspace").click(() => {
    socket.emit('[Workspace] - remove user', $("#workspaceId").val(), $("#currentUserId").val());
    nonAccess();
  });

  socket.on('[Workspace] -  removed user', function () {
    //TODO: I don't know what to do ?
    nonAccess();
  })

  $("#confirm-workspace-leave").modal({
    ready: (modal, trigger) => {
      $("#workspaceId").val($(trigger).attr('workspaceId'))
    }
  });

  $(document).on('click', '#delete-the-workspace', () => {
    const workspaceId = $('#workspaceIdDelete').val();
    workspaceDeleteReq.open("DELETE", `/workspace/${workspaceId}`);
    workspaceDeleteReq.send(null);
  });
});
