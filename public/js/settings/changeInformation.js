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
    },
  },
  message: {
    completeName: '',
    Email: '',
  },
});

const imgExtensions = ['jpg', 'png', 'svg'];
const modeNormal = $('#mode-normal');
const modeEdit = $('#mode-modification');
const divChangePassword = $('#change-password');
const divOrganization = $('#list-organization');
const userCompleteNameInput = $('#completeName');
const emailInput = $('#Email');
const imgDiv = $('#input-img-div');

$('.materialboxed').materialbox();

$(document).on('click', '#modify-user', (event) => {
  userCompleteNameInput.prop('disabled', false);
  emailInput.prop('disabled', false);
  modeNormal.hide();
  divOrganization.hide();
  imgDiv.show();
  divChangePassword.show();
  modeEdit.show();
});

$(document).on('click', '#accept-modify,#cancel-modify', (params) => {
  $('.collapsible').collapsible('close', 0);
  userCompleteNameInput.prop('disabled', true);
  emailInput.prop('disabled', true);
  modeEdit.hide();
  imgDiv.hide();
  divChangePassword.hide();
  modeNormal.show();
  divOrganization.show();
});

function getFileExtension(filename = '') {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function readURL(input) {
  if (input.files && input.files[0]) {
    if (imgExtensions.includes(getFileExtension(input.files[0].name).toLowerCase())) {
      const reader = new FileReader();

      reader.onload = function (e) {
        $('#profile-picture').attr('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      Materialize.toast("Wrong File Format", 1000, 'rounded red lighten-2');
    }
  }
}

$('#picture-input').on('change', (event) => {
  readURL(document.getElementById('picture-input'));
});

const avatar = $('#avatar-input');

const getInitialStateAvatar = new XMLHttpRequest();
getInitialStateAvatar.onreadystatechange = function (event) {
  if (this.readyState === 4) {
    if (this.status === 200) {
      avatar.val(this.response);
      console.log(this.response);
    } else {
      avatar.initial();
      console.log('Afficher une image simple, basique');
    }
  }
};

const has = Object.prototype.hasOwnProperty;

$('#change-password-btn').on('click', event => {
  event.preventDefault();
  const changePassword = $('#change-password');
  const inputs = changePassword.find('input').map((key, input) => input.value);
  const lastPassword = inputs[0],
    newPassword = inputs[1],
    confirmPassword = inputs[2];

  const error = checkInputs(lastPassword, newPassword, confirmPassword);
  changePassword.find('#error').text(error);
  if (error === '') {
    socket.emit('changePassword', { lastPassword, newPassword, confirmPassword });
  }
});

socket.on('changePassword', (data) => {
  console.log(data, typeof data);
  if (has.call(data, 'error'))
    $('#change-password').find('#error').text(data.error);
  else {
    $('#accept-modify').click();
  }
});

function checkInputs(lastPassword, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    return ('Both passwords are different.');
  } else if (newPassword.length < 6) {
    return ('Please enter at least 6 characters.');
  }
  return ('');
}

getInitialStateAvatar.open('GET', `/user/${CurrentUser}/image`);
getInitialStateAvatar.send();
