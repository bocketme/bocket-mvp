/**
 * Created by jean-adriendomage on 10/11/2017.
 */

const express = require("express");
let router = express.Router();
let controller = require("../controllers/nodeController");

router.get("/", controller.index);

module.exports = router;