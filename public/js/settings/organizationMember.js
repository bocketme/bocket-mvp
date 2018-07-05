function removeOrganization(organizationId, userId) {
  Materialize.toast('Ongoing deletion', 1000);
  socket.emit('[Organization] - remove', organizationId, userId);
};

socket.on('[Organization] - remove', (err) => {
  if (err)
    Materialize.toast('Cannot Delete This User', 1000);
  else {
    Materialize.toast('User deleted. Page reloading...', 1000);
    setTimeout(function () { document.location.reload(true) }, 1000);
  }
});

const modifiable = $('.modifiable');

modifiable.on('change', () => {
  const newRole = this.value;
  const userSelected = this.attr('userId');
  socket.emit('[User] - changeRights', newRole, userSelected, CurrentOrganization);
});
