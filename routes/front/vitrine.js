const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path');

router.get("/index", (req, res) => {
    res.redirect("/");
});

router.get("/", (req, res) => {
    res.render("vitrine", {
        assets_name: "vitrine",
        page_name: "Accueil"
    });
    console.log(req.cookies);
});

module.exports = router;