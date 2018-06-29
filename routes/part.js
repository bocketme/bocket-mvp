const express = require('express');
const log = require('../utils/log');
const upload = require('multer')();
const postController = require('../controllers/Part/post');
const getController = require('../controllers/Part/get');
const putController = require('../controllers/Part/put');

const router = express.Router();

router.put('/update/:nodeId', upload.fields([{ name: 'file3D', maxCount: 1 }, { name: 'textureFiles' }]), putController.updatePart)
router.post('/:nodeId', upload.fields([{ name: 'files3d', maxCount: 1 }, { name: 'specs' }, { name: 'textures' }]), (req, res, next) => {
  postController.newPart(req, res).catch(err => next(err));
});
router.post('/:nodeId/:type/:partId', upload.fields([{ name: 'sentFile', maxCount: 1 }]), (req, res, next) => {
  postController.addFileToPart(req, res).catch(err => next(err))
});
router.get('/:nodeId/modeler', getController.modeler);

router.use((err, req, res, next) => {
  log.error(err);
  res.status(500).send('Intern Error');
});

module.exports = router;
