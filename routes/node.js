const express = require("express");
const router = express.Router();
const { GET, DELETE, POST, UPDATE } = require('../controllers/Node');
const upload = require('multer')();

router.get('/:nodeId', GET.file3D);
router.get('/:nodeId/information', GET.NodeInformation);
router.get('/material/:nodeId/:texture', GET.texture);

router.post('/:nodeId/changeInfo', POST.nodeInformation);
router.post('/:nodeId/3D', upload.single('file'), POST.send3DFile);
router.post('/:nodeId/Texture', upload.single('file'), POST.sendTexture);
router.post('/:nodeId/Spec', upload.single('file'), POST.sendSpecFiles);

router.put('/:nodeId/convert', UPDATE.launchConversion);
router.put('/:nodeId/changeEmplacementFiles/:file/3dToSpec', UPDATE.transfert3DToSpec);
router.put('/:nodeId/changeEmplacementFiles/:file/SpecTo3D', UPDATE.transfertSpecTo3D);

router.delete('/:nodeId/3D/:file', DELETE.delete3D);
router.delete('/:nodeId/Texture/:file', DELETE.deleteTexture);
router.delete('/:nodeId/spec/:file', DELETE.deleteSpec);

module.exports = router;
