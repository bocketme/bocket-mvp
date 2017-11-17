const router = require('express').Router(),
controllers = require('../controllers/projectController.js');


// router.get('/jwt', controllers.usejwt);
router.get('/:organization/', controllers.index);
router.get('/:organization/updates', controllers.last_updates);
router.get('/:organization/duplicates', controllers.duplicates);
router.post('/', controllers.add);
// router.update('/', controllers.update);
// router.delete('/', controllers.delete);

module.exports = router;