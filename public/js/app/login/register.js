const $IDENTIFICATION_MODAL = $(`#authentification-modal`);

const $LOGIN_BOX = $('#log-in-box');

const $LOGIN_FORM_TRIGGER = $('#log-in-form-trigger');

const $LOGIN_BOX_FORM = $('#sign-in-form-box');

const $SIGNUP_BOX = $('#sign-up-form');

const $SIGNUP_BOX_FORM = $('#sign-up-form-box');

const $SIGNUP_FORM_TRIGGER = $('#sign-up-form-trigger');

const $IDENTIFICATION_BOX = $('#register-form');


$(document).ready(function () {
  //Lancement de la modale d'authentification
  $IDENTIFICATION_MODAL.modal({
    complete: () => {
      $LOGIN_BOX_FORM.hide();
      $SIGNUP_BOX_FORM.hide();
      $SIGNUP_BOX.find('input').val("");
      $LOGIN_BOX.find('input').val("");
    }
  });

  $(document).on('click', "[href='#authentification-modal']", function (params) {
    initialShow($(this).hasClass("sign-in-trigger"))
  })

  $("").click()

  $LOGIN_BOX_FORM.hide();
  $SIGNUP_BOX_FORM.hide();

  //Evenements de la modale d'authentification
  $LOGIN_FORM_TRIGGER.click(moveToLogin);
  $SIGNUP_FORM_TRIGGER.click(moveToSignup);
});


function moveToLogin(event) {
  const { left } = $SIGNUP_BOX.position();
  $IDENTIFICATION_BOX.animate({ left: '8.3%' }, 100, "swing");
  $LOGIN_BOX_FORM.show();
  $SIGNUP_BOX_FORM.hide();
  $IDENTIFICATION_BOX.find('input').val("");
}

function moveToSignup(event) {
  const { left } = $LOGIN_BOX.position();
  $IDENTIFICATION_BOX.animate({ left: '51.7%' }, 100, "swing");
  $SIGNUP_BOX_FORM.show();
  $LOGIN_BOX_FORM.hide();
  $IDENTIFICATION_BOX.find('input').val("");
}

function initialShow(login_show = true) {
  if (login_show) {
    $IDENTIFICATION_BOX.css({ left: '8.3%' });
    $LOGIN_BOX_FORM.show();
  } else {
    $IDENTIFICATION_BOX.css({ left: '51.7%' });
    $SIGNUP_BOX_FORM.show();
  }
}
