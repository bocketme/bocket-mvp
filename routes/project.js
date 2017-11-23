const router = require('express').Router(),
controllers = require('../controllers/projectController.js');


// router.get('/jwt', controllers.usejwt);
router.post('/', controllers.indexPOST);
router.get('/:workspaceId/', controllers.index);
router.get('/:workspaceId/updates', controllers.last_updates);
router.get('/:workspaceId/duplicates', controllers.duplicates);
router.post('/', controllers.add);
// router.update('/', controllers.update);
// router.delete('/', controllers.delete);

module.exports = router;