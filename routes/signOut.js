const express = require("express");
let router = express.Router();
let signOutController = require('../controllers/signOutController');

router.get("/", signOutController.index);

module.exports = router;