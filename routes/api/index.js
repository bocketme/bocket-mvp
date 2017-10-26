const annotationAPI = require('./annotation'),
    branchAPI = require("./branch"),
    commentsAPI = require("./commentaire"),
    commitAPI = require("./commit"),
    issueAPI = require('./issue'),
    nodeAPI = require('./node'),
    notificationsAPI = require('./notifications'),
    projectsAPI = require('./projects'),
    pull_requestAPI = require("./pull_request"),
    rights_fileAPI = require("./rights_file"),
    rightsAPI = require("./rights"),
    userAPI = require('./users'),
    express = require("express"),
    menuBuilderAPI = require('./menu_builder'),
    buildAPI = require('./build'),
    index_Branch = require('./branch/index'),
    git_serveAPI = require('./git_serve'),
    specfilesAPI = require('./specfiles'),
    promote = require('./promote'),
    demote = require('./demote'),
    menuBuilder = require('./menu_builder'),
    router = express.Router();

router.use(index_Branch);
router.use(git_serveAPI);
router.use(buildAPI);
router.use(menuBuilderAPI);
router.use(annotationAPI);
router.use(branchAPI);
router.use(commentsAPI);
router.use(commitAPI);
router.use(issueAPI);
router.use(nodeAPI);
router.use(notificationsAPI);
router.use(projectsAPI);
router.use(pull_requestAPI);
router.use(rights_fileAPI);
router.use(rightsAPI);
router.use(userAPI);
router.use(specfilesAPI);
router.use(promote);
router.use(demote);
router.use(menuBuilder);

module.exports = router;