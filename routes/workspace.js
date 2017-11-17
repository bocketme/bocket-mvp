const express = require("express");
let router = express.Router();
let controller = require("../controllers/workspace");

router.post("/create", controller.createWorkspace);

module.exports = router;