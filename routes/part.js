const express = require("express");
let router = express.Router();
let upload = require('multer')();
let postController = require("../controllers/Part/post");
let getController = require("../controllers/Part/get");
let putController = require("../controllers/Part/put");

router.put('/update/:nodeId', upload.fields([{name:'file3D', maxCount: 1}]), putController.updatePart)
router.post('/:nodeId', upload.fields([{name:'file3D', maxCount: 1}, {name:'specFiles'}]), postController.newPart);
router.get('/:nodeId/modeler', getController.modeler);
module.exports = router;