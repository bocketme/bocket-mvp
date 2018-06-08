$(document).on('click', '#delete-account', function (event) {
  const getUserOwnerShip = new XMLHttpRequest();
  getUserOwnerShip.open('GET', '/user/Ownership');
  getUserOwnerShip.onreadystatechange = function (event) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        $('#modal-confirm-deletion-content').html(this.response);
      } else
        Materialize.toast(`Cannot delete the workspace`, 1000);
    }
  };
  getUserOwnerShip.send();
  $('#modal-confirm-deletion-content').html('');
  $('#user-options').modal('close');
  $('#confirmDeleteAccount').modal('open');
});

$(document).on('click', '#confirm-delete-user', function (event) {
  const deleteUserRequest = new XMLHttpRequest();
  deleteUserRequest.open('DELETE', '/user');
  deleteUserRequest.send();
  deleteUserRequest.onreadystatechange = function (event) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        Materialize.toast(`Your account is deleted`, 500);
        setTimeout(function (params) {
          document.location.href = "/signOut";
        }, 1000)
      } else
        Materialize.toast(`Cannot delete the workspace`, 1000);
    }

  }
});
