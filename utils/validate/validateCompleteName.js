const regex = require("../regex");

module.exports = (email) => {
    var re = regex.completeName;
    return re.test(email.toLowerCase());
};
