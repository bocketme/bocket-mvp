const express = require("express"),
    connection = require('../../database/index'),
    Promise = require('promise'),
    git_log = require('../../bucketgit/git_history'),
    router = express.Router();

var promisify_path = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT project.path as projectPath, node.path as nodePath FROM project, node, branch WHERE (node.id = ?) AND (node.id_branch = branch.id) AND (branch.id_project = project.id);", [id_node], (err, results, fields) => {
            if (err) {
                console.log("Promisify Path : ", err.sqlMessage);
                reject({ status: 500, message: "Intern Error" });
            } else if (!results)
                reject({ status: 404, message: "Not Found" });
            else
                resolve(results);
        });
    });
};

router.get("/api/node/searchcommit/:node", (req, res) => {
    let id_node = req.params.node;

    promisify_path(id_node)
        .then((results) => {
            return new Promise((resolve, reject) => {
                git_log(results[0].projectPath, results[0].nodePath, (err, results) => {
                    if (err) {
                        console.log("Git Log : ", err);
                        reject({ status: 404, message: "Not Found" });
                    } else resolve(results);
                });
            });
        })
        .then((log) => { res.send(log); })
        .catch((err) => { res.status(err.status).send(err.message); })
        .done();
});

module.exports = router;