function removeOrganization(organizationId, userId) {
  Materialize.toast('Ongoing deletion', 1000);
  socket.emit('[Organization] - remove user', organizationId, userId);
};

const modifiable = $('.modifiable');

modifiable.on('change', () => {
  const newRole = this.value;
  const userSelected = this.attr('userId');
  socket.emit('[User] - changeRights', newRole, userSelected, CurrentOrganization);
});
