const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    connection = require('../../database/index'),
    init = require('../../bucketgit/git_init'),
    uuid = require('uuid-v4.js');
/**
 * Get all the projects in the database
 */
router.get('/api/projects', (req, res) => {
    connection.query("SELECT * FROM project ", (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length === 0) {
            res.send("There is no result");
        } else {
            res.send(results);
        }
    });
});

/**
 * Get the project name
 */
router.get('/api/projectname/:id', (req, res) => {
    let projectId = req.params.id;
    connection.query("SELECT name FROM project where id = ?", [projectId], (err, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        if (err)
            res.status(500).send({
                err: ""
            });
        if (results.length === 0) {
            res.send("There is no result");
        } else {
            res.status(200).send(results);
        }
    });
});

/**
 * Get all the user of a specific project
 */
router.get('/api/project/getuser/:id', (req, res) => {
    let projectId = req.params.id;
    connection.query("SELECT user.* FROM user, affectation, team, project WHERE (user.id = affectation.id_user) AND (project.id = ?) AND (project.id_team = team.id) AND (affectation.id_team = team.id) ", [projectId],
        (err, results, fields) => {
            res.setHeader('Content-Type', 'application/json');
            if (err)
                res.status(500).send({
                    err: ""
                });
            if (results.length === 0) {
                res.status(404).send({
                    err: "Document not Found"
                });
            } else {
                res.status(200).send(results);
            }
        });
});

/**
 * Get a specific project by his id
 */
router.get('/api/projects/:idproject', (req, res) => {
    let projectId = req.params.idproject;
    connection.query("SELECT * FROM project WHERE id = ?", [projectId], (err, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        if (err)
            res.status(500).send({
                err: ""
            });
        if (results.length === 0) {
            res.status(404).send({
                err: "Document not Found"
            });
        } else {
            res.status(200).send(results);
        }
    });
});

/**
 * Get all the projects where the user is in
 */
router.get("/api/user/projects/:userId", (req, res) => {
    let id_user = req.params.userId;
    connection.query('SELECT project.* from project, affectation, team WHERE (affectation.id_user = ?) AND (affectation.id_team = team.id) AND (team.id = project.id_team)', [id_user], (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length == 0)
            res.status(400).send('No results');
        else
            res.status(200).send(JSON.stringify(results));
    });
});


const promiseSQL = require('./utils/promiseSQL');

var projectNew = (req, res) => {
    let id_team = req.params.idTeam,
        id_organization = req.query.organization,
        project_name = req.params.projectName,
        description = req.params.projectDescription,
        project_path = uuid();

    let _id_files3d, _author, _id_branch, _id_project;

    return promiseSQL.newFiles3d('master', uuid())
        .then((id_files3d) => {
            _id_files3d = id_files3d;
            return promiseSQL.newProject(project_name, description, project_path, id_organization, id_team);
        })
        .then((id_project) => {
            _id_project = id_project;
            return promiseSQL.newBranch(null, 'master', null, id_project);
        })
        .then((id_branch) => {
            _id_branch = id_branch;
            return promiseSQL.newNode('master', uuid(), 0, false, null, _id_files3d, id_branch);
        })
        .then((id_node) => {
            return promiseSQL.setNodesBranch(id_node, _id_branch);
        })
        .then(() => {
            //TODO: GET AUTHOR
            console.log("lala");
            return promiseSQL.getAuthor(id_team);
        })
        .then((author) => {
            console.log(author);
            _author = author[0].id;
            return new Promise((resolve, reject) => {
                init(project_path, 'master', 'master', author[0].email, author[0].username, (err, results) => {
                    if (err)
                        reject({
                            status: 500,
                            message: "Intern Error"
                        });
                    else if (results)
                        resolve();
                });
            });
        })
        .then(() => promiseSQL.setBranchProject(_id_branch, _id_project))
        .then(() => res.status(200).end())
        .catch(err => {
            if (err instanceof Error) {
                console.log(err);
                res.status(500).send("Intern Error").end();
            } else
                res.status(err.status).send(err.message);
        })
        .done();
};
router.post("/api/project/:idTeam/:projectName/:projectDescription", [projectNew]);

module.exports = router;