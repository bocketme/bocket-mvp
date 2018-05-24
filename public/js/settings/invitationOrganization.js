$(document).ready(function () {
  const invitePeopleError = $('#invite-people-error');
  const inviteOrganizationModal = $("#invite-organisation");
  resetMember();
  inviteOrganizationModal.modal({
    complete: function () {
      resetMember();
      invitePeopleError.css("visibility", "hidden");
    }
  });
  $(document).on('click', '.deleteUser', deleteUser);
  $(document).on('click', '#invite-people-submit', function (event) {
    event.preventDefault();
    const invitePeopleInputs = $("#invite-people-form").find("input"),
      people = [];
    for (var i = 0; i < invitePeopleInputs.length; i++) {
      if (invitePeopleInputs[i].attributes.type.value === 'email' && (invitePeopleInputs[i].value !== '' && validateEmail(invitePeopleInputs[i].value))) {
        const email = $(invitePeopleInputs[i]).val(),
          completeName = $(invitePeopleInputs[i + 1]).val(),
          role = $(invitePeopleInputs[i + 2]).parent().find('select').val();
        people.push({ email, completeName, role });
      }
    }
    if (people.length > 0) {
      console.log(people);
      socket.emit("[Invitation] - orgnanization", CurrentOrganization, people);
    } else
      invitePeopleError.css("visibility", "visible");
    return false;
  });
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

function resetMember() {
  const part1 = '<div class="col s12" style="padding: 30px 0">\n' +
    '<div class="input-field col s3">\n' +
    '<input id="email" type="email" class="validate">\n' +
    '<label for="email">Mail</label>\n' +
    '</div>\n' +
    '<div class="input-field col s3 push-s1">\n' +
    '<input id="completeName" type="text" class="validate">\n' +
    '<label for="completeName">Name</label>\n' +
    '</div>\n' +
    '<div class="input-field col s3 push-s2">\n' +
    '<select>\n' +
    '<option value="" disabled selected>Choose a role</option>\n';
  const hasRights = userRights === 6 ? '<option value="5">Co-Owner</option>\n' : '';
  const part3 = '<option value="4">Member</option>\n' +
    '</select>\n' +
    '<label>Role</label>\n' +
    '</div>\n' +
    '<i class="material-icons right deleteUser">highlight_off</i>\n' +
    '</div>\n';
  const user = part1 + hasRights + part3;
  const html = $(user);
  $('#list-member-invitation').html(html);
  $('select:last').material_select();
}

function addMember() {
  const part1 = '<div class="col s12" style="padding: 30px 0">\n' +
    '<div class="input-field col s3">\n' +
    '<input id="email" type="text" class="validate">\n' +
    '<label for="email">Mail</label>\n' +
    '</div>\n' +
    '<div class="input-field col s3 push-s1">\n' +
    '<input id="completeName" type="text" class="validate">\n' +
    '<label for="completeName">Name</label>\n' +
    '</div>\n' +
    '<div class="input-field col s3 push-s2">\n' +
    '<select>\n' +
    '<option value="" disabled selected>Choose a role</option>\n';
  const hasRights = userRights === 6 ? '<option value="5">Co-Owner</option>\n' : '';
  const part3 = '<option value="4">Member</option>\n' +
    '</select>\n' +
    '<label>Role</label>\n' +
    '</div>\n' +
    '<i class="material-icons right deleteUser">highlight_off</i>\n' +
    '</div>\n';
  const user = part1 + hasRights + part3;
  const html = $(user);
  $('#list-member-invitation').append(html);
  $('select:last').material_select();
}

function deleteUser() {
  $(this).parent().remove();
}
