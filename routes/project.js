const router = require('express').Router(),
controllers = require('../controllers/projectController.js');


// router.get('/jwt', controllers.usejwt);
router.post('/:workspace/', controllers.index);
router.get('/:workspace/updates', controllers.last_updates);
router.get('/:workspace/duplicates', controllers.duplicates);
router.post('/', controllers.add);
// router.update('/', controllers.update);
// router.delete('/', controllers.delete);

module.exports = router;