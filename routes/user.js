const express = require("express");
let router = express.Router();
const controller = require("../controllers/User/usersInformation");

router.get('/photo/:userId', controller.userImage);

module.exports = router ;