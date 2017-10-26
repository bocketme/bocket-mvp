const express = require("express"),
    router = express.Router(),
    isAuthentificated = require('./utils/isAuthentificated'),
    newnode = require('../../controllers/new-node');

router.get('/new-node/:idProject', isAuthentificated, newnode.get);

module.exports = router;