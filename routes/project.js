const router = require('express').Router(),
controllers = require('../controllers/projectController.js');


router.get('/', [controllers.usejwt, controllers.index]);
router.post('/', controllers.add);
// router.update('/', controllers.update);
// router.delete('/', controllers.delete);

module.exports = router;