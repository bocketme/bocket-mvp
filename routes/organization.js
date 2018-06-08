const { Router } = require('express');
const router = Router();

const organizationController = require('../controllers/organizationController');

const controller = require('../controllers/Organization');

router.get('/:organizationId', controller.get.index);
router.get('/:organizationId/members', controller.get.members);
router.get('/:organizationId/workspaces', controller.get.workspaces);
router.post('/:organizationId/info', organizationController.changeInformation);
router.post('/:organizationId/delete', organizationController.deleteOrganization);
router.post('/:organizationId/workspace', organizationController.createWorkspace);

router.put('/:organizationId/leave', controller.update.leaveOrganization);
router.delete('/:organizationId', controller.delete);

module.exports = router;
