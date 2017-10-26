const express = require("express"),
    router = express.Router(),
    connection = require('../../database/index');

let getFilesByProject = (req, res) => {

    let projectId = req.params.idProject;
    res.setHeader("content-type", "application/json");



};
router.get('/api/specfiles/:idProject', [getFilesByProject]);


let getFilesByNode = (req, res) => {

    let idProject = req.params.idProject,
        idNode = req.params.idNode;

    res.setHeader("content-type", "application/json");

    connection.query('INSERT INTO organization (id_projet, id_stripe, id_owner) VALUES (?,?,?)', [id_project, id_stripe, id_owner], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!result)
            res.status(404).send("Not Found").end();
        else
            res.send(JSON.stringify(result));
    });
};

router.get('/api/specfiles/:idProject/:idNode', [getFilesByNode]);

module.exports = router;