const { email } = require("../regex");

module.exports = (email) => {
    return email.test(email.toLowerCase());
};
