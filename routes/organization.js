const { Router } = require('express');
const router = Router();

const organizationController = require('../controllers/organizationController');

router.get('/:organizationId', organizationController.index);
router.get('/:organizationId/members', organizationController.members);
router.get('/:organizationId/workspaces', organizationController.workspaces);
router.post('/:organizationId/delete', organizationController.deleteOrganization);
router.post('/:organizationId/workspace', organizationController.createWorkspace)
module.exports = router;
