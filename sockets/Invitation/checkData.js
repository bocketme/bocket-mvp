const validateEmail = require('../../utils/validate/validateEmail');
const validateCompleteName = require('../../utils/validate/validateCompleteName');

const checkData = function(socket, data) {
  const ret = [];
  for (let i = 0; i < data.length; i += 1) {
    const emailIsValid = validateEmail(data[i].email);
    if (emailIsValid)
      ret.push(data[i]);
    else {
      const err = !emailIsValid ? 'email' : 'name';
      console.error(`Cannot Invite ${data[i].email}, the ${err} is not valid`);
      socket.emit('[Invitation] - error', `Cannot Invite ${data[i].email}, the ${err} is not valid`);
    }
  }
  return ret;
};

module.exports = checkData;
