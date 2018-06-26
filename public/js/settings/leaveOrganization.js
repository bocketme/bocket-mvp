$(document).on('click', '#send-the-new-owner', function (event) {
  const leaveOrganizationRequest = new XMLHttpRequest();
  leaveOrganizationRequest.open('PUT', `/organization/${CurrentOrganization}/leave/${$('select[name="organization-new-owner"]').val()}`);
  leaveOrganizationRequest.send(null);
  leaveOrganizationRequest.onreadystatechange = function (event) {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        document.location.reload(true);
      } else {
        Materialize.toast('Cannot Leave The Organization', 1000);
      }
    }
  }
});

$(document).on('change', 'select[name="organization-new-owner"]', function (event) {
  $('#send-the-new-owner').removeClass('disabled');
});

$(document).on('click', '#delete-the-organization', function (event) {
  const deleteOrganizationRequest = new XMLHttpRequest();
  deleteOrganizationRequest.open('DELETE', `/organization/${CurrentOrganization}`);
  deleteOrganizationRequest.send();
  deleteOrganizationRequest.onreadystatechange = function (event) {
    if (this.readyState === XMLHttpRequest.DONE) {
      if (this.status === 200) {
        socket.emit("");
        document.location.reload(true);
      } else {
        Materialize.toast('Cannot Leave The Organization', 1000);
      }
    }
  }
});
