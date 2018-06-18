$(document).ready(function () {
  const invitePeopleError = $('#invite-people-error');
  const inviteWorkspace = $("#invite-workspace");
  const hiddenWorkspace = $('#hidden-Workspace');

  resetMember();
  inviteWorkspace.modal({
    ready: function (modal, trigger) {
      $('#content-workspace-invitation').html('')
      const workspaceId = $(trigger).attr('workspaceId');
      hiddenWorkspace.val(workspaceId);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/workspace/${workspaceId}/listOrganization`);
      xhr.onreadystatechange = function (event) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            $('#content-workspace-invitation').html(this.responseText)
            $('#workspace-invitation-tabs').tabs();
            $('select[name="role"]').material_select();
          } else {
            console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
          }
        }
      }
      xhr.send(null);
    },
    complete: function () {
      $('#content-workspace-invitation').html('')
      resetMember();
      hiddenWorkspace.val('');
      invitePeopleError.css("visibility", "hidden");
    }
  });
  $(document).on('click', '.deleteUser', deleteUser);
  $(document).on('click', '#invite-people-submit', function (event) {
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
      socket.emit("[Invitation] - workspace", hiddenWorkspace.val(), people);
    } else
      invitePeopleError.css("visibility", "visible");
    return false;
  });
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

function lineUser() {
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
  const hasRights = userRights > 4 ? '<option value="3">Product Manager</option>\n' : '';
  const part3 = '<option value="2">Member</option>\n' +
    '</select>\n' +
    '<label>Role</label>\n' +
    '</div>\n' +
    '<i class="material-icons right deleteUser">highlight_off</i>\n' +
    '</div>\n';
  const user = part1 + hasRights + part3;
  return user;
};

function resetMember() {
  const user = lineUser();
  const html = $(user);
  $('#list-member-invitation').html(html);
  $('select:last').material_select();
}

function addMember() {
  const user = lineUser();
  const html = $(user);
  $('#list-member-invitation').append(html);
  $('select:last').material_select();
}

function deleteUser() {
  $(this).parent().remove();
}

socket.on('[Invitation] - workspace', (message) => Materialize.toast(message));
$(document).on('click', '#invite-member-submit', function (event) {
  console.log('emmm')
  event.preventDefault();
  const forms = $('#invite-member-form').find('input');
  const _id = [];
  const role = [];
  for (var i = 0; i < forms.length; i++) {
    if (forms[i].attributes.type.value === 'checkbox' && $(forms[i]).is(':checked') && $(forms[i + 2]).parent().find('select').val()) {
        _id.push($(forms[i + 1]).val());
        role.push($(forms[i + 2]).parent().find('select').val());
    }
  }
  const $form = $('#invite-member-form');
  if(_id.length === 0) return null;
  $.post($form.attr('action'), {_id, role},function() {
    document.location.reload(true);    
  })
});
