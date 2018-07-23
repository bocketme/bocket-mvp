const formInformtaion = $('#form-Informtaion');

formInformtaion.validate({
  rules: {
    completeName: {
      required: true,
      minLength: 5,
    },
    Email: {
      required: true,
      email: true,
    }
  },
  message: {
    completeName: "",
    Email: ""
  }
});

const modeNormal = $('#mode-normal');
const modeEdit = $("#mode-modification");
const divChangePassword = $("#change-password");
const divOrganization = $("#list-organization");
const userCompleteNameInput = $("#completeName");
const emailInput = $("#Email");

$(document).on('click', '#modify-user', function (event) {
  userCompleteNameInput.prop("disabled", false)
  emailInput.prop("disabled", false)
  modeNormal.hide();
  divOrganization.hide();
  divChangePassword.show();
  modeEdit.show();
});

$(document).on('click', '#accept-modify,#cancel-modify', function (params) {
  $('.collapsible').collapsible('close', 0);
  userCompleteNameInput.prop("disabled", true);
  emailInput.prop("disabled", true);
  modeEdit.hide();
  divChangePassword.hide();
  modeNormal.show();
  divOrganization.show();
});

const avatar = $('#avatar');

const getInitialStateAvatar = new XMLHttpRequest();
getInitialStateAvatar.onreadystatechange = function (event) {
  if (this.readyState === 4) {
    if (this.status === 200) {
      avatar.val(this.response);
    } else 
    console.log('Afficher une image simple, basique');
  }
}

getInitialStateAvatar.open('GET', `/user/${CurrentUser}/image`);
getInitialStateAvatar.send();
