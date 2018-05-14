const { Router } = require('express');
const router = Router();

const workspaceController = require('../controllers/workspaceController');

router.post('/:workspaceId/information', workspaceController.changeInfo);

module.exports = router;
