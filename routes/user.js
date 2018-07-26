const router = require('express').Router();
const upload = require('multer')();

const { GET, DELETE, POST } = require('../controllers/User');

router.get('/', GET.render);
router.get('/image', GET.getAvatar);
router.get('/membership', GET.membership);
router.get('/ownership', GET.ownership);
router.delete('/', DELETE);
router.post('/update', POST.changeInformation);
router.post('/avatar', upload.fields([{ name: 'avatar', maxCount: 1 }]), (req, res, next) => {
  POST.changeAvatar(req, res).catch(err => next(err));
});


module.exports = router;
