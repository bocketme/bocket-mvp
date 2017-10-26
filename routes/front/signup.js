const express = require("express"),
    router = express.Router(),
    user = require('../../controllers/user');

router.get('/signup', user.signup.get);

router.post('/signup', user.signup.post_verifyEmail, user.signup.post_verifyUsername, user.signup.post_sendMySQL, user.signup.error_handler);

module.exports = router;