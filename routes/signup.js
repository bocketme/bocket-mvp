const express = require("express");
let router = express.Router();
let controller = require("../controllers/signUpController");

router.post("/", controller.index);

module.exports = router;