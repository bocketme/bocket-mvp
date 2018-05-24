const userAuthorization = require('./userAuthorization');

module.exports = (schema, options) => {
  userAuthorization(schema, options);
};
