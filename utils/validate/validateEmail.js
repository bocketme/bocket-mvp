const { email } = require("../regex");

module.exports = (emailTested) => {
  return email.test(emailTested.toLowerCase());
};
