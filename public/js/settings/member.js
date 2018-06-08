$(document).on('change', 'select[name=organizationManager]', function (event) {
  console.log('socket emited')
  const selection = $(this);
  const role = selection.val(),
    userId = selection.attr('userId');
  socket.emit("[Organization] - changeRoles", CurrentOrganization, userId, role);
});

const listAdminsAndMembers = $('#adminsAndMembers');

socket.on("[Organization] - changeRoles", (message, html) => {
  if (message) {
    Materialize.toast(message)
  } else {
    listAdminsAndMembers.html('');
    listAdminsAndMembers.html(html);
    $('select').material_select();
  }
});
