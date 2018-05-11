//const clearNodeChildren = require('./clearNodeChildren');
//const fetchTheCreationOrga = require('./fetchThecreationOrga');
const organizationCleaner = require('./OrganizationCleaner');
const workspaceCleaner = require('./WorkspaceCleaner');
const userCleaner = require('./UserCleaner');

module.exports = function*() {
  console.log(1)
  yield organizationCleaner();
  console.log(1)
  yield workspaceCleaner();
  console.log(1)
  yield userCleaner();
}
