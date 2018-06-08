const { Router } = require('express');
const router = Router();

const workspaceController = require('../controllers/workspaceController');

const controller = require('../controllers/Workspace')

router.post('/:workspaceId/information', workspaceController.changeInfo);

router.get('/image', (req, res) => res.status(404).send('Not Found'))
//Render the user page
router.get('/:workspaceId', controller.update.changeOption, controller.get.index);
router.get('/:workspaceId/listOrganization', controller.get.listOrganization)

//Index ????? logIn + workspace REDIRECTION 
router.post('/', controller.post.indexPost)
//Create a new Workspace
router.post('/:workspaceId');

//Add organization Member to a workspace
router.post('/:workspaceId/addOrganizationMember', controller.post.addOrganizationMember );
//Update the workspace Information
router.put('/:workpsaceId/information', controller.update.changeInformation);

//Delete the workspace
router.delete('/:workspaceId', controller.delete.deleteWorkspace);

module.exports = router;
