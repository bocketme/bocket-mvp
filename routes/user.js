const express = require("express");
let router = express.Router();
const getController = require("../controllers/User/usersInformation");

router.get('/photo/:userId', getController.userImage);
router.post('/photo/:userId', )
module.exports = router;
