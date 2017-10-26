const express = require("express"),
    router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/signin');
});

module.exports = router;