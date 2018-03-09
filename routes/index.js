const express = require('express');

const router = express.Router();
const controller = require('../controllers/IndexController');

router.get('/', controller.index);
router.get('/:invitationUid', controller.invitation);
router.get('/download/:nodeId/:filename', controller.download);
router.get('/download/:nodeId/native/:filename', controller.downloadNode);
module.exports = router;
