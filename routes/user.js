const router = require('express').Router();

const { GET, DELETE } = require('../controllers/User');

router.get('/image', GET.image);
router.get('/membership', GET.membership);
router.get('/ownership', GET.ownership);
router.delete('/', DELETE);

module.exports = router;
