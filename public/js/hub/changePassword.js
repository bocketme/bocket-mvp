modal$(document).ready(() => {
  const has = Object.prototype.hasOwnProperty;
  $('#submit-change-pwd').on('click', () => {
    const changePassword = $('#change-password');
    const inputs = changePassword.find('input').map((key, input) => input.value);
    const lastPassword = inputs[0], newPassword = inputs[1], confirmPassword = inputs[2];

    const error = checkInputs(lastPassword, newPassword, confirmPassword);
    changePassword.find('#error').text(error);
    if (error !== '') {
      socket.emit('changePassword', { lastPassword, newPassword, confirmPassword });
    }
  });

  socket.on('changePassword', (data) => {
    if(data)
      $('#change-password').find('#error').text(data.error);
    else
      $('#change-password').modal('close');

    console.log('CHANGE PASSWORD RECEIVED:', data)
  });

  function checkInputs(lastPassword, newPassword, confirmPassword) {
    console.log(newPassword, confirmPassword);
    if (newPassword !== confirmPassword) {
      return ('Both passwords are different.');
    } else if (newPassword.length < 6) {
      return ('Please enter at least 6 characters.');
    }
  }
});
