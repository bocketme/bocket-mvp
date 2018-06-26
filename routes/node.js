const express = require("express");
const router = express.Router();
const { GET } = require('../controllers/Node');

router.get('/:nodeId', GET.File3D);
router.get('/material/:nodeId/:texture', GET.FileTexture);

module.exports = router;
