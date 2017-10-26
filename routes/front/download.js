const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    isAuthentificated = require('./utils/isAuthentificated');

router.get('/download-file-global/:idProject/:filename', (req, res) => {
    res.download('../' + req.params.idProject + '/specfiles/global/' + req.params.filename);
});

module.exports = router;