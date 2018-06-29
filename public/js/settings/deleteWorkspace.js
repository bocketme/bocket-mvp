const workspaceDeleteReq = new XMLHttpRequest();

function nonAccess () {
  setTimeout(function () {
    Materialize.toast('You can no longer access to this workspace, the page will reload');
    document.location.reload(true);
  }, 200)
}

let workspaceSelected;

$("#leave-the-workspace").click(function () {
  socket.emit('[Workspace] - remove', $("#leave-the-workspace").attr("workspaceId"), CurrentUser);
  nonAccess();
});

socket.on('[Workspace] -  removed user', function () {
  //TODO: I don't know what to do ?
  nonAccess();
})

$(document).ready(function() {
  $("#confirm-workspace-leave").modal({
    ready: (modal, trigger) => {
      $("#leave-the-workspace").attr("workspaceId", $(trigger).attr('workspaceId'))
    }
  });

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
          setTimeout(document.location.reload(true), 5000)
        }
      };
      $("#workspaceIdDelete").val($(trigger).attr('workspaceId'));
    }
  });
})

$(document).on('click', '#delete-the-workspace', () => {
  const workspaceId = $('#workspaceIdDelete').val();
  workspaceDeleteReq.open("DELETE", `/workspace/${workspaceId}`);
  workspaceDeleteReq.send(null);
});
