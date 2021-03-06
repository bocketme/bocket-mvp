const leaveTheOrganization = $('#leave-the-organization');
leaveTheOrganization.on('click', () => {
  $('#confirm-leave-organization').modal('open');
});

$('#quit-the-organization').on('click', () => {
  socket.emit('[Organization] - remove', CurrentOrganization, CurrentUser);
})

const deleteOrganizationWanted = $('#delete-organization-wanted');
deleteOrganizationWanted.on('click', () => {
  if (userRights === 6)
    $('#confirm-delete-organization').modal('open');
  else
    Materialize.Toast('You have no rights to delete the organization');
});

const organizationNameInput = $('#organizationName');
const organizationNameSubmit = $('#new-organization-submit');
organizationNameInput.on('input', () => {
  const inputVal = organizationNameInput.val();
  if (inputVal !== "") {
    organizationNameSubmit.removeClass('disabled');
    organizationNameSubmit.css('background-color', '#00cca0')
  } else {
    organizationNameSubmit.addClass('disabled');
    organizationNameSubmit.css('background-color', '#DFDFDF')
  }
});

organizationNameSubmit.on('click', () => {
  socket.emit('[Organization] - create', organizationNameInput.val());
  organizationNameInput.val('');
});
socket.on('[Organization] - create', (err, redirection) => {
  if (err) {
    console.error(err);
    Materialize.toast('Cannot create the organization');
  } else {
    document.location.href = redirection;
  }
});

socket.on("[Organization] - deleted",
  () => $("#organization-deleted").modal('open'));

socket.on("[Organization] - removed",
  () => $("#organization-removed").modal('open'));
