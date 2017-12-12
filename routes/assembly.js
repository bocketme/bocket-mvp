const express = require("express");
let router = express.Router();
let upload = require('multer')();
let postController = require("../controllers/Assembly/post");

router.post('/:nodeId', upload.fields([{name:'file3D', maxCount: 1}, {name:'specFiles'}]), postController.newAssembly);

module.exports = router;