const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    user = require('../../controllers/user');

router.get("/signin", user.signin.get);

router.post("/signin", [user.signin.post, user.signin.error_handler]);

module.exports = router;