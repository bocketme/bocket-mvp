const modifiable = $('.modifiable');

modifiable.on('change', () => {
  const newRole = this.value;
  const userSelected = this.attr('userId');
  socket.emit('[User] - changeRights', newRole, userSelected, CurrentOrganization);
});