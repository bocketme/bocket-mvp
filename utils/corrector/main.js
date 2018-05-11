//const clearNodeChildren = require('./clearNodeChildren');
//const fetchTheCreationOrga = require('./fetchThecreationOrga');
const organizationCleaner = require('./OrganizationCleaner');
const workspaceCleaner = require('./WorkspaceCleaner');
const userCleaner = require('./UserCleaner');

module.exports = function*() {
  yield organizationCleaner();
  yield workspaceCleaner();
  yield userCleaner();
}