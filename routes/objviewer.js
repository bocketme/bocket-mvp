const express = require("express"),
    router = express.Router(),
    envTEST = require('../bucketgit/test'),
    obj_request = require('../controllers/obj'),
    mtl_request = require('../controllers/mtl');

//Environnement de test Nodegit pour Alexis
router.get('/ini', envTEST);

/**
 * GET_OBJ
 */
router.get('/get_obj/:project/:node/:file', obj_request.get);

/**
 * GET_MTL
 */
router.get('/get_mtl/:project/:node/:file', mtl_request.get);

/**
 * SEND-OBJ
 */
router.post('/send_obj/:project/:node/:file', obj_request.post);

/**
 * SEND MTL
 */
router.post('/send_mtl/:project/:node/:file', mtl_request.post);


module.exports = router;