const leaveTheOrganization = (rights) => {
  if (rights === 6) {
    $('#leaveConfirmOwner').modal('open');
  } else
    socket.emit('[Organization] - leave');
};

const deleteTheOrganization = (rights) => {
  if (rights === 6)
    $('#deleteTheOrganization').modal('open');
  else
    Materialize.Toast('You have no rights to delete the organization');
};