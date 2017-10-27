const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    res.render("signup");
});

module.exports = router;