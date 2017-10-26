const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    crypto = require('crypto'),
    Promise = require('promise'),
    connection = require('../../database/index'),
    read_file = require('../../bucketgit/git_read').read,
    add_node = require('../../bucketgit/git_add_node');

/**
 * Renvoie le contenu du fichier obj et mtl depuis le serveur distant.
 */
var getNodeandProjectName = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT project.path, node.path as nodePath, files3d.name as filename  FROM node, project, branch, files3d where (node.id = ?) AND (node.id_branch = branch.id) AND (project.id = branch.id_project) AND (files3d.id = node.id_files3d)", [id_node], (err, results, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                reject(({
                    status: 500,
                    message: "Internal Error"
                }));
            } else if (!results || results.length === 0) {
                resolve('no result');
            } else {
                resolve(results[0]);
            }
        });
    });
};

/**
 * We get the .obj for a specific node
 * @param {*} req 
 * @param {*} res 
 */
var getNodeObj = (req, res) => {
    let nodeId = req.params.id;
    res.setHeader('Content-Type', 'application/json');
    getNodeandProjectName(nodeId)
        .then((project) => {
            read_file(project.path, project.filename, project.nodePath, (err, result) => {
                if (err)
                    return Promise.reject(err);
                else
                    return Promise.resolve(result);
            });
        })
        .catch((err) => {
            res.status(err.status).send(err.message).end();
        })
        .done((result) => {
            res.status(200).end(result);
        });
};

var getNodeMtl = (req, res) => {};


let getNodefiles3d = (req, res) => {
    let nodeId = req.params.id,
        _project,
        data = new Object();
    res.setHeader('Content-Type', 'application/json');
    getNodeandProjectName(nodeId)
        .then((project) => {
            _project = project;
            return new Promise((resolve, reject) => {
                read_file(_project.path, _project.filename + '.obj', _project.nodePath, (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else
                        resolve(result);
                });
            });
        })
        .then(obj => {
            data.obj = obj.toString();
            data.filename = _project.filename;
            return new Promise((resolve, reject) => {
                read_file(_project.path, _project.filename + '.mtl', _project.nodePath, (err, result) => {
                    if (err) {
                        console.log(err);
                        resolve(null);
                    } else
                        resolve(result);
                });
            });
        })
        .then(mtl => data.mtl = mtl.toString())
        .then(() => res.send(data))
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err.message).end();
        })
        .done();
};
router.get('/api/node/files3d/:id', [getNodefiles3d]);

let postNodefiles3d = (req, res) => {
    let nodeId = req.params.id,
        nameObj = req.body.nameobj,
        namemtl = req.body.namemtl,
        dataobj = req.body.dataobj,
        datamtl = req.body.datamtl;
};

router.post('/api/node/files3d/:id', [postNodefiles3d]);

/**
 * Getting child node
 */
router.get("/api/node/search/child/:node",
    (req, res) => {
        let node = req.params.node;
        connection.query('SELECT * FROM node WHERE (node.node_parent = ?', [node],
            (err, results, fields) => {
                if (err)
                    console.log(err);
                res.setHeader('Content-Type', 'application/json');
                if (results.length === 0)
                    res.send("There is no result");
                else
                    res.status.end(JSON.stringify(results));
            });
    }
);

/**
 * Get an obj file from the node
 */
router.get('/api/nodemtl/:id', (req, res) => {
    let nodeId = req.params.id;
    connection.query("SELECT * FROM filesmtl, node where (filesmtl.id = ?) AND (node.id_filesMTL = ?)", [nodeId, nodeId], (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length === 0) {
            res.status(404).send("There is no result");
        } else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});

/**
 * A retravailler.
 */
var sendNodeSQL = (name, node_parent, id_project, id_files3d, id_branch) => {
    connection.query("INSERT INTO node SET ?", {
        name: name,
        state_of_maturity: 0,
        node_parent: node_parent,
        id_project: id_project,
        id_files3d: id_files3d,
        id_branch: id_branch
    }, (err, result, fields) => {
        if (err) {
            return (err);
        } else {
            return (result.insertId);
        }
    });
};

/**
 *
 *
 * @param {String} name
 * @returns {Object}
 */
var sendfiles3dSQL = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO files3d SET ?", {
            name: name
        }, (err, results, fields) => {
            if (err) {
                resolve(err);
            } else {
                reject(result.insertId);
            }
        });
    });
};

var getRepoPathSQL = (id_project) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT path FROM project WHERE id = ?", [id_project], (error, results, fields) => {
            if (error) {
                console.log(error);
                reject({
                    status: 500,
                    message: "Intern Error"
                });
            } else if (results.length == 0)
                reject({
                    status: 500,
                    message: "Not Found"
                });
            else
                resolve(results);
        });
    });
};

var sendCommitSQL = (title, date, author, git_oid, id_files3d) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO commit SET ?", {
            title: title,
            date_of_commit: date,
            author: author,
            git_oid: git_oid,
            id_files3d: id_files3d
        }, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.insertId);
            }
        });
    });
};

var getIdBranchByNodeSQL = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT branch.id FROM node, branch WHERE (node.id = ?) AND (node.id_branch = branch.id)", [id_node], (err, results, fields) => {
            if (error) {
                console.log(error);
                reject(({
                    status: 500,
                    message: "Intern Error"
                }));
            } else if (!results)
                reject(({
                    status: 400,
                    message: "Not Found"
                }));
            else if (results.length == 0)
                reject(({
                    status: 400,
                    message: "Not Found"
                }));
            else
                resolve(results);
        });
    });
};

var promiseSQL = require('./utils/promiseSQL');

var addNodeChild = (req, res, next) => {
    let node_name = req.params.nodeName,
        node_parent = req.params.node_parent;

    //TODO: Récuperer la branche et l'id du noeud parent
    promiseSQL.newFiles3d(node_name, 'zouzouzouzou')
        .then((id_files3d) => {
            _id_files3d = node_name;
            return promiseSQL.getNodeParent(node_parent);
        })
        .then((results) => {
            return promiseSQL.newNode(results[0].project.id, node_name, _id_files3d, results[0].branch.id);
        })
        .then(() => {
            return add_node(repo_path, node_name, node_name, null, null, nameAuthor, mailAuthor, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).end(err);
                } else if (result)
                    console.log(result);
            });
        });

};

var errorhandler = (err, req, res, next) => {
    // Erreur : Supprimer tous les changements.
};

router.post("/api/node/node_child/:node_parent/:nodeName", [addNodeChild]);

/**
 * Get the node child by the nodefirst.
 */
router.get("/api/project/node_child/:project", (req, res) => {
    var project = req.params.project;
    connection.query("SELECT node.id FROM node, project, branch WHERE (node.id = ?) AND (node.node_parent = NULL) AND (node.id_branch = branch.id) AND (branch.name = master);", (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!results)
            res.status(404).send("Not Found").end();
        else if (results.length == 0)
            res.status(404).send("Not Found").end();
        else
            res.status(200).send(JSON.parse(results));
    });
});

/**
 *
 */
router.get('/api/nodes/:idProject', (req, res) => {

    let id_project = req.params.idProject;

    connection.query("SELECT DISTINCT node.* from node, branch WHERE (branch.id_project = ?) AND (node.id_branch = branch.id) ", [id_project], (err, results, fields) => {
        if (err) {
            res.status(500).send(("Intern Error"));
        } else if (!results) {
            res.status(404).end();
        } else if (results.length == 0) {
            res.status(404).end();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
});

/**
 * Get a specific node informations
 * @param {*} req
 * @param {*} res
 */
var getNodeInfos = (req, res) => {

    let idNode = req.params.idNode;

    connection.query("SELECT * FROM node WHERE id = ?", [idNode], (err, results, fields) => {
        if (err) {
            res.status(500).send(("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).end();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};

router.get('/api/nodeinfo/:idNode', [getNodeInfos]);


let getNodeByUser = (req, res) => {
    let username = req.query.username,
        password = req.query.password,
        data = "%" + req.query.data + "%";

    connection.query("SELECT node.name FROM node, rights_file, affectation, user WHERE (user.username = ?) AND (user.password = ?) AND (affectation.id_user = user.id) AND (rights_file.id_affectation = affectation.id) AND (node.id = rights_file.id_node) AND (node.name IN(SELECT name FROM node WHERE name LIKE ?)", [username, password, data], (err, results, fields) => {
        if (err) {
            res.status(500).send(("Intern Error"));
        } else if (!results) {
            res.status(400).end();
        } else if (results.length == 0) {
            res.status(400).end();
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};

router.get("/api/node/search/user", [getNodeByUser])

module.exports = router;