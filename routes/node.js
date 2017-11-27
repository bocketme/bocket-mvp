/**
 * Created by jean-adriendomage on 10/11/2017.
 */

const express = require("express");
let router = express.Router();
let controller = require("../controllers/nodeController");
let upload = require('multer')();

router.get("/", controller.index);
router.get("/:node", controller.get);
router.post("/:node/new_part", upload.array(), controller.newPart);
router.post("/child/:workspaceId", upload.array(), controller.newChild);

module.exports = router;