const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    connection = require('../database/index'),
    viewer3d = require('./objviewer'),
    indexAPI = require("./api/index"),
    fileUpload = require('express-fileupload'),
    mkdirp = require('mkdirp'),
    formidable = require('formidable'),
    frontRoutes = require('./front/index'),
    objviewer = require('./objviewer');



if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('../scratch');
}


/**
 * Getting api routes
 */
router.use(indexAPI);
/**
 * Using front routes
 */
router.use(frontRoutes);
router.use(objviewer);

/**
 *
 */
router.get("/viewer", (req, res, next) => {
    res.render("viewer", {
        page_name: "viewer"
    });
});

router.get("/splitview", (req, res, next) => {
    res.render("splitview", {
        page_name: "splitview"
    });
});



module.exports = router;