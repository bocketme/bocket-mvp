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
const avatar = $('#profile-picture');

$('.materialboxed').materialbox();

$(document).on('click', '#modify-user', (event) => {
  switchToEditMode();
});

$(document).on('click', '#accept-modify', (params) => {
  uploadNewAvatar();
  const completeName = userCompleteNameInput.val();
  updateInformations(completeName);
  switchToNormalMode();
});

$(document).on('click', '#cancel-modify', (params) => {
  switchToNormalMode();
});

function switchToNormalMode() {
  $('.collapsible').collapsible('close', 0);
  userCompleteNameInput.prop('disabled', true);
  // emailInput.prop('disabled', true);
  modeEdit.hide();
  imgDiv.hide();
  divChangePassword.hide();
  modeNormal.show();
  divOrganization.show();
  $('#picture-input').val('');
}

function switchToEditMode() {
  userCompleteNameInput.prop('disabled', false);
  // emailInput.prop('disabled', true);
  modeNormal.hide();
  divOrganization.hide();
  imgDiv.show();
  divChangePassword.show();
  modeEdit.show();
}

function getFileExtension(filename = '') {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function readURL(input) {
  if (input.files && input.files[0]) {
    if (imgExtensions.includes(getFileExtension(input.files[0].name).toLowerCase())) {
      const reader = new FileReader();

      reader.onload = function (e) {
        if ($('#img-profile').length) {
          $('#profile-picture').html(`<img src="${e.target.result}" class="materialboxed circle responsive-img">`);
        }
        $('#profile-picture img').attr('src', e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      Materialize.toast('Wrong File Format', 1000, 'rounded red lighten-2');
    }
  }
}

$('#picture-input').on('change', (event) => {
  readURL(document.getElementById('picture-input'));
});


function updateInformations(completeName) {
  if (completeName !== undefined) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function (event) {
      if (this.readyState === 4) {
        if (this.status === 200) {
          Materialize.toast('Updated Profile successfully', 1000, 'rounded green lighten-2');
        } else {
          Materialize.toast('Error: could not update informations', 1000, 'rounded red lighten-2');
        }
      }
    };
    request.open('POST', '/user/update');
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({ completeName }));
  }
}

const getInitialStateAvatar = new XMLHttpRequest();
getInitialStateAvatar.onreadystatechange = function (event) {
  if (this.readyState === 4) {
    if (this.status === 200) {
      const image = new Image();
      avatar.html(image);
      image.src = `data:image/png;base64, ${this.response}`;
      $('#profile-picture img').addClass('circle');
    } else {
      avatar.html(`<img id="img-profile" data-name="${$('#completeName').val()}" class=" materialboxed avatar profile circle"/>`);
      $('#img-profile').initial();
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
  if (has.call(data, 'error'))
    $('#change-password').find('#error').text(data.error);
  else {
    switchToNormalMode();
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

function uploadNewAvatar() {
  const request = new XMLHttpRequest();

  const handleErrorsFct = function () {
    return function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          Materialize.toast('Picture updated', 1000, 'rounded green lighten-2');
        } else if (request.status === 404) {
          Materialize.toast('Not Found', 1000);
        }
      }
    };
  };

  const file = document.getElementById('picture-input').files[0];
  if (!file)
    return;

  request.open('POST', '/user/avatar', true);
  request.onreadystatechange = handleErrorsFct();
  const form = new FormData();
  form.append('avatar', file);
  request.send(form);
}

getInitialStateAvatar.open('GET', '/user/image');
getInitialStateAvatar.send();
