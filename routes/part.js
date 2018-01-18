const express = require("express");
let router = express.Router();
let upload = require('multer')();
let postController = require("../controllers/Part/post");
let getController = require("../controllers/Part/get");

router.post('/:nodeId', upload.fields([{name:'file3D', maxCount: 1}, {name:'specFiles'}]), postController.newPart);
router.get('/:nodeId/modeler', getController.modeler);
module.exports = router;