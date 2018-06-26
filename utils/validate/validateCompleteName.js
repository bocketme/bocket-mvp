const { completeName } = require("../regex");

module.exports = (email) => {
    return completeName.test(email.toLowerCase());
};
