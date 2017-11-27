const express = require("express");
let router = express.Router();
let controller = require("../controllers/workspace");
let get = require('../controllers/Workspace/get')

router.post("/create", controller.createWorkspace);
router.get('/:workspaceId/', get.index);
router.get('/:workspaceId/updates', get.last_updates);
router.get('/:workspaceId/duplicates', get.duplicates);
router.post('/', get.indexredirect);


module.exports = router;