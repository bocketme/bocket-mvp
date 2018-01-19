const express = require("express");
let router = express.Router();
let controller = require("../controllers/IndexController");

router.get("/", controller.index);
router.get("/:invitationUid", controller.invitation);

module.exports = router;