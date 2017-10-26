/**
 * Created by jean-adriendomage on 26/10/2017.
 */

const express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

module.exports = router;