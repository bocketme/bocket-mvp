function addUser(rights) {
  const hasRights = rights > 4 ? '                    <option value="3">Product Manager</option>\n' : '';
  const user = '        <div class="col s12" style="padding: 30px 0">\n' +
    '            <div class="input-field col s3">\n' +
    '                <input id="email" type="text" class="validate">\n' +
    '                <label for="email">Mail</label>\n' +
    '            </div>\n' +
    '            <div class="input-field col s3 push-s1">\n' +
    '                <input id="completeName" type="text" class="validate">\n' +
    '                <label for="completeName">Name</label>\n' +
    '            </div>\n' +
    '            <div class="input-field col s4 push-s2">\n' +
    '                <select>\n' +
    '                    <option value="" disabled selected>Choose a role</option>\n' +
    +hasRights+
    '                    <option value="2">Member</option>\n' +
    '                    <option value="1">Observer</option>\n' +
    '                </select>\n' +
    '                <label>Role</label>\n' +
    '            </div>\n';
  const invitationList = document.getElementById('list-member-invitation');
  invitationList.innerHTML += user;
  $('select').material_select();
}

function resetUser(rights) {
  const hasRights = rights > 4 ? '                    <option value="3">Product Manager</option>\n' : '';
  const user = '        <div class="col s12" style="padding: 30px 0">\n' +
    '            <div class="input-field col s3">\n' +
    '                <input id="email" type="text" class="validate">\n' +
    '                <label for="email">Mail</label>\n' +
    '            </div>\n' +
    '            <div class="input-field col s3 push-s1">\n' +
    '                <input id="completeName" type="text" class="validate">\n' +
    '                <label for="completeName">Name</label>\n' +
    '            </div>\n' +
    '            <div class="input-field col s4 push-s2">\n' +
    '                <select>\n' +
    '                    <option value="" disabled selected>Choose a role</option>\n' +
    hasRights +
    '                    <option value="2">Member</option>\n' +
    '                    <option value="1">Observer</option>\n' +
    '                </select>\n' +
    '                <label>Role</label>\n' +
    '            </div>\n';
  const invitationList = document.getElementById('list-member-invitation');
  invitationList.innerHTML = user;
  $('select').material_select();
}
$(document).ready(function(){
  $('#workspace-creation').modal({complete: function () {}});
  $('#invite-people').modal({
    ready: function() {
      resetUser();
    },
    complete: function () {
      resetUser();
    }});


  $('select').material_select();
});
