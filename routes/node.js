/**
 * Created by jean-adriendomage on 10/11/2017.
 */

const express = require("express");
let router = express.Router();
let controller = require("../controllers/nodeController");
let upload = require('multer')();
let postController = require("../controllers/Node/post")

router.get("/", controller.index);
router.get("/:node", controller.get);
// router.post("/:node/new_part", upload.array(), controller.newPart);
router.post("/child/:nodeId", upload.array('create_node_specFiles'), postController.new_node);

module.exports = router;