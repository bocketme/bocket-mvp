const express = require("express"),
    router = express.Router(),
    vitrine = require('./vitrine'),
    signin = require('./signin'),
    dashboard = require('./dashboard'),
    nomenclature = require('./nomenclature'),
    pullrequest = require('./pullrequest'),
    issues = require('./issues'),
    singleIssue = require('./single-issue'),
    home = require('./home'),
    newProject = require('./new-project'),
    singlePullrequest = require('./single-pullrequest'),
    files = require('./files'),
    newNode = require('./new-node'),
    download = require('./download'),
    newBranch = require('./new-branch'),
    logout = require('./logout'),
    profile = require('./profile'),
    signup = require('./signup');


router.use(vitrine);
router.use(signin);
router.use(dashboard);
router.use(nomenclature);
router.use(pullrequest);
router.use(issues);
router.use(singleIssue);
router.use(home);
router.use(newProject);
router.use(singlePullrequest);
router.use(files);
router.use(newNode);
router.use(download);
router.use(newBranch);
router.use(logout);
router.use(profile);
router.use(signup);

module.exports = router;