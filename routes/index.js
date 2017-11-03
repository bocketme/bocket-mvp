const express = require("express");
let router = express.Router();
let controller = require("../controllers/IndexController");

router.get("/", controller.index);

module.exports = router;