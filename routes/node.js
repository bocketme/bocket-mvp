const express = require("express");
const router = express.Router();
const controllers = require('../controllers/Node/get');

router.get('/:nodeId', controllers.getFile3D)
router.get('/:nodeId/:texture', controllers.getFileTexture)

module.exports = router
