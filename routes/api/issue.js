const express = require("express"),
    connection = require('../../database/index'),
    router = express.Router();

var verificationIssueUser = (req, res, next) => {
    let username = req.query.username,
        password = req.query.password,
        id_issue = req.params.issueid;
    connection.query("SELECT user.* FROM user, affectation, team, project WHERE (user.username = ?) AND (user. password = ?) AND (user.id = affectation.id_user) AND (team.id = affectation.id_team) AND (team.id = project.id_team) AND (issue.id = ?) AND (issue.id_project = project.id) ", [username, password, id_issue], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!results) {
            res.status(500).send("Intern Error").end();
        } else if (results.length == 0) {
            res.status(401).send("No Right").end();
        } else {
            next();
        }
    });
};
/**
 * We get an issue by his id
 * @param {*} req 
 * @param {*} res 
 */
var getissue = (req, res) => {
    let id_issue = req.params.issueid;
    connection.query("SELECT * FROM issue WHERE (id = ?) ", [id_issue], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!results) {
            res.status(500).send("Intern Error").end();
        } else if (results.length == 0) {
            res.status(404).send("Not Found").end();
        } else {
            res.status(200).send(results).end();
        }
    });
};
//router.get("/api/issue/:issueid", [verificationIssueUser, getissue]);
router.get("/api/issue/:issueid", [getissue]);

/**
 * 
 */
var verificationIssueProject = (req, res, next) => {
    let project = req.params.idproject,
        username = req.query.username,
        password = req.query.password;
    connection.query("SELECT user.* FROM user, affectation, team, project WHERE (user.username = ?) AND (user. password = ?) AND (user.id = affectation.id_user) AND (team.id = affectation.id_team) AND (team.id = project.id_team) AND (project.id = ?) ", [username, password, project], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!results) {
            res.status(500).send("Intern Error").end();
        } else if (results.length == 0) {
            res.status(401).send("No Right").end();
        } else {
            next();
        }
    });
};

/**
 * We get all the issues from a specific project
 * @param {*} req 
 * @param {*} res 
 */
var getIssues = (req, res) => {
    let project = req.params.idproject;
    connection.query("SELECT issue.* From issue, project WHERE (project.id = ?) ", [project], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!results) {
            res.status(500).send("Intern Error").end();
        } else if (results.length == 0) {
            res.status(404).send("Not Results Found").end();
        } else {
            res.status(200).send(results).end();
        }
    });
};
router.get("/api/project/issues/:idproject", [getIssues]);
//router.get("/api/project/issues/:idproject", [verificationIssueProject, getIssues]);

module.exports = router;