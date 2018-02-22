const router = require('express').Router(),
controllers = require('../controllers/projectController.js');


// router.get('/jwt', controllers.usejwt);
router.post('/', controllers.indexPOST);
router.get('/:workspaceId/', controllers.index);
module.exports = router;