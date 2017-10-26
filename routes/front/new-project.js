const express = require("express"),
    router = express.Router(),
    isAuthentificated = require('./utils/isAuthentificated'),
    project = require('../../controllers/project');

router.get('/new-project', isAuthentificated, project.get);

router.post('/new-project', isAuthentificated, project.post);

module.exports = router;