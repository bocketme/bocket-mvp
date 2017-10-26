const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated'),
    branch = require('../../controllers/branch');

router.get('/new-branch/:idProject', isAuthentificated, branch.get);

router.post("/new-branch/:idProject", isAuthentificated, branch.post);

module.exports = router;