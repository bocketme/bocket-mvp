$(document).ready(function () {
  $REGISTER_MODAL.modal({
    ready: function (modal, trigger) {
      initialShow(trigger.hasClass(LOGIN_TRIGGER))
    }
  });

  $LOGIN_FORM_TRIGGER.click(moveToLogin);
  $SIGNUP_FORM_TRIGGER.click(moveToSignup);
});


function moveToLogin() {
  const { left } = $LOGIN_FORM.position();
  $IDENTIFICATION_BOX.animate({ left }, 100, "swing");
  $SIGNUP_FORM.find('input').val("");
}

function moveToSignup() {
  const { left } = $SIGNUP_FORM.position();
  $IDENTIFICATION_BOX.animate({ left }, 100, "swing");
  $LOGIN_FORM.find('input').val("");
}

function initialShow(login_show = true) {
  if (login_show)
    $IDENTIFICATION_BOX.css('left', $LOGIN_FORM.position().left);
  else
    $IDENTIFICATION_BOX.css('left', $SIGNUP_FORM.position().left);
}
