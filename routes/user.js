const userSchema = require('../models/User');
const organizationSchema = require('../models/Organization');
const path = require('path');
const fs = require('fs');
const FileSystemConfig = require('../config/FileSystemConfig');
const log = require('../utils/log');
const router = require('express').Router();

const { GET, DELETE } = require('../controllers/User');

router.get('/', GET.render);
router.get('/image', GET.image);
router.get('/membership', GET.membership);
router.get('/ownership', GET.ownership);
router.delete('/', DELETE);

module.exports = router;
