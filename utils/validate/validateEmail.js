const regex = require("../regex");

module.exports = (email) => {
    var re = regex.email;
    return re.test(email.toLowerCase());
};
