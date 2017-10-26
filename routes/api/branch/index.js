const express = require("express"),
    router = express.Router();

router.use(require('./merge'));
router.use(require('./branch_new'));

module.exports = router;