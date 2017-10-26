const express = require("express"),
    connection = require('../../database/index'),
    router = express.Router();

let verifSpecCom = (req, res, next) => {
        let username = req.query.username,
            password = req.query.password,
            specfile = req.params.specfile;

        connection.query("SELECT rights_file.write_right FROM user, affectation, rights_file, specfile WHERE (user.usename = ?) AND (user.password = ?) AND (user.id = affectation.id_user) AND (rights_file.id_affectation = affectation.id) AND (specfile.id = rights_file.id_specfile) AND (specfile.id = ?)", [username, password, specfile], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send("Intern Error").end();
            } else if (!results)
                res.status(500).send("Intern Error").end();
            else if (results.length == 0)
                res.status().send("No read right for this file").end();
            else if (results.rights_file == true)
                next();
            else
                res.status().send("No read right for this file").end();
        });
    },
    verifIssueCom = (req, res, next) => {
        let username = req.query.username,
            password = req.query.password,
            issue = req.params.issue;

        connection.query("SELECT user.* FROM user, affectation, team, project, issue  WHERE (user.usename = ?) AND (user.password = ?) AND (user.id = affectation.id_user) AND (team.id = affectation.id_team) AND (team.id = project.id_team) AND (project.id = issue.id_project) AND (issue.id = ?)", [username, password, specfile], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send("Intern Error").end();
            } else if (!results)
                res.status(500).send("Intern Error").end();
            else if (results.length == 0)
                res.status().send("Not Authorized").end();
            else if (results)
                next();
            else
                res.status().send("Not Authorized").end();
        });
    },
    verifFiles3dCom = (req, res, next) => {
        let username = req.query.username,
            password = req.query.password,
            specfile = req.params.specfile;

        connection.query("SELECT rights_file.write_right FROM user, affectation, rights_file, files3d WHERE (user.usename = ?) AND (user.password = ?) AND (user.id = affectation.id_user) AND (rights_file.id_affectation = affectation.id) AND (files3d.id = rights_file.id_files3d) AND (files3d.id = ?)", [username, password, specfile], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send("Intern Error").end();
            } else if (!results)
                res.status(500).send("Intern Error").end();
            else if (results.length == 0)
                res.status().send("No read right for this file").end();
            else if (results.rights_file == true)
                next();
            else
                res.status().send("No read right for this file").end();
        });
    };

/**
 * Get the comments assigned to an issue
 * @param {*} req 
 * @param {*} res 
 */
let getCommIssue = (req, res) => {
    let issueId = req.params.issue_id;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_issue = ? ORDER BY date_of_publish ASC", [issueId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};
router.get('/api/comments/issue/:issue_id', [getCommIssue]);

/**
 * We get the comments on a specific file 3D
 * @param {*} req 
 * @param {*} res 
 */
let getCommFiles3d = (req, res) => {
    let file3DId = req.params.id_files3d;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_files3d = ? ORDER BY date_of_publish ASC", [file3DId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};
router.get('/api/comments/3Dfile/:idSpecFile', [getCommFiles3d]);

/**
 * We get the comments on a specific specfile
 * @param {*} req 
 * @param {*} res 
 */
let getCommSpecfile = (req, res) => {
    let specFileId = req.params.idSpecFile;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_specfile = ? ORDER BY date_of_publish ASC", [specFileId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};
router.get('/api/comments/specfile/:idSpecFile', [getCommSpecfile]);

/**
 * We get the comments on a pull request
 * 
 * @param {*} req 
 * @param {*} res 
 */
let getCommPullRequest = (req, res) => {
    let pullrequestId = req.params.idPr;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_pull_request = ? ORDER BY date_of_publish ASC", [pullrequestId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};
router.get('/api/comments/pullrequest/:idPr', [getCommPullRequest]);

/**
 * We get the comments on a branch
 * @param {*} req 
 * @param {*} res 
 */
let getCommBranch = (req, res) => {
    let branchId = req.params.idBranch;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_branch = ? ORDER BY date_of_publish ASC", [branchId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};

router.get('/api/comments/branch/:idBranch', [getCommBranch]);

/**
 * We get the comments by nodes for the sidebar
 * @param {*} req 
 * @param {*} res 
 */
let getCommNode = (req, res) => {
    let nodeId = req.params.idNode;

    connection.query("SELECT id, content, date_of_publish, id_author FROM comments WHERE id_node = ? ORDER BY date_of_publish ASC", [nodeId], (err, results, fields) => {
        if (err) {
            res.status(500).send(new Error("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).send("No results");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};
router.get('/api/comments/node/:idNode', [getCommNode]);

module.exports = router;