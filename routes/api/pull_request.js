const express = require("express"),
    router = express.Router(),
    connection = require('../../database/index');

/**
 * Search all the pull_request of a project
 */
router.get("/api/project/search_pull_request/:id_project", (req, res) => {
    let id_project = req.params.id_project;
    connection.query("SELECT * from pull_request where id_project = ?", [id_project], (err, results, fields) => {


        if (err) {
            console.log(err.sqlMessage);
            res.status(500).send("Intern Error");
        } else if (results.length === 0) {
            res.send("There is no result");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
});

/**
 * Get a specific pull request by his id
 * 
 */

router.get('/api/project/get_pull_request/:idpr', (req, res) => {

    let idPullRequest = req.params.idpr;

    connection.query("SELECT * from pull_request where id = ?", [idPullRequest], (err, results, fields) => {
        if (err) {
            console.log(err.sqlMessage);
            res.status(500).send("Intern Error");
        } else if (results.length === 0) {
            res.status(400).send("Nothing found");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
});

/**
 * Create a pullrequest for a project
 */
var verifAddPullRequest = (req, res, next) => {
    var username = req.query.username,
        password = req.query.password;

    next();
};
var addPullRequest = (req, res) => {
    let title = req.params.title,
        content = req.params.content,
        branchSource = req.params.branchSource,
        branchDestination = req.params.branchDestination,
        idProject = req.params.idProject;


    connection.query("INSERT INTO pull_request (title, content, branch_source, branch_destination, id_project) VALUES (?, ?, ?, ?, ?)", [title, content, branchSource, branchDestination, idProject],
        err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else {
                res.status(200).end();
            }
        });
};
router.post("/api/project/add_pull_request/:title/:content/:branchSource/:branchDestination/:idProject", [addPullRequest]);


module.exports = router;