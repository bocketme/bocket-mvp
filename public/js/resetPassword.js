$(document).ready(() => {
  const has = Object.prototype.hasOwnProperty;

  $('#form-change-pwd').on('submit', event => {
    event.preventDefault();
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
    console.log(data);
    if (has.call(data, 'error'))
      $('#change-password').find('#error').text(data.error);
    else
    {

    }
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