const express = require("express");
const router = express.Router();
const { GET } = require('../controllers/Node');

router.get('/:nodeId', GET.File3D);
router.get('/material/:nodeId/:texture', GET.FileTexture);

router.delete('/:nodeId/spec')
router.delete('/:nodeId/3D')
router.delete('/:nodeId/Texture')

module.exports = router;
