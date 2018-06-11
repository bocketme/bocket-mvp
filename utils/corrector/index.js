//const clearNodeChildren = require('./clearNodeChildren');
//const fetchTheCreationOrga = require('./fetchThecreationOrga');
const organizationCleaner = require('./OrganizationCleaner');
const workspaceCleaner = require('./WorkspaceCleaner');
const userCleaner = require('./UserCleaner');
const log = require('../log')

module.exports = function* () {
  log.info('[Correction] - Started');
  log.info('[Correction] - Organization : Started...');
  yield organizationCleaner();
  log.info('[Correction] - Organization : Finised');
  log.info('[Correction] - Workspace : Started...');
  yield workspaceCleaner();
  log.info('[Correction] - Workspace : Finised');
  log.info('[Correction] - User : Started...');
  yield userCleaner();
  log.info('[Correction] - User : Finised');
  log.info('[Correction] - Finished');
}
