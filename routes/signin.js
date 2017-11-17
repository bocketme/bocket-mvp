const express = require("express");
let router = express.Router();
let signInController = require('../controllers/signInController');

router.post("/", signInController.index);

module.exports = router;