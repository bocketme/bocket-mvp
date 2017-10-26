const express = require("express"),
    EventEmmiter = require('events'),
    connection = require('../../database/index'),
    router = express.Router(),
    uuid = require('uuid-v4.js'),
    copydata = new EventEmmiter(),
    middControl = require('./utils/middleware_controll'),
    promiseSQL = require('./utils/promiseSQL'),
    Promise = require('promise'),
    add_node = require('../../bucketgit/git_add_node');


/************************************************************/
/*                                                          */
/*                                                          */
/*           Récupère les utilisateurs d'un project         */
/*                                                          */
/*                                                          */
/************************************************************/

let getAllBranchesByProject = (req, res) => {
    let id_project = req.params.projectId;

    connection.query("SELECT branch.* FROM branch WHERE id_project= ?", [id_project], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error"));
        else if (!results)
            res.status(404).end();
        else if (results.length == 0)
            res.send("There is no result");
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};


/************************************************************/
/*                                                          */
/*                                                          */
/*         Récupère la branche d'un noeud selectionné       */
/*                                                          */
/*                                                          */
/************************************************************/

let getBranchByNodeBase = (req, res) => {
    let id_node = req.params.node;
    connection.query("SELECT branch.* FROM branch, node WHERE (node.id = ?) AND (node.id_branch = branch.id)", [id_node], () => {
        if (err)
            res.status(500).send(new Error("Intern Error"));
        else if (!results)
            res.status(404).end();
        else if (results.length == 0)
            res.send("There is no result");
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};

/************************************************************/
/*                                                          */
/*                                                          */
/*         Renomme la branche selectionné                   */
/*                                                          */
/*                                                          */
/************************************************************/


let renameBranch = (req, res) => {
    let name = req.query.name,
        id_branch = req.params.branchId;
    connection.query("UPDATE branch SET ? WHERE id = ?", [{
        name: name
    }, id_branch], (err, results, fields) => {
        if (err)
            res.status(500).send("Intern Error");
        else
            res.status(200);
    });
};

/************************************************************/
/*                                                          */
/*                                                          */
/*  Supprime une branche avec tous les noeuds d'une branche */
/*                                                          */
/*                                                          */
/************************************************************/


//TODO: A retravailler
let deleteNode = (req, res) => {
    let id_branch = req.params.branch;
    connection.query("DELETE FROM node WHERE id_branch = ?", [id_branch], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error : ".concat(err.sqlMessage)));
        else
            next();
    });
};
let deleteBranch = (req, res) => {
    let id_branch = req.params.branch;
    connection.query("DELETE FROM branch WHERE id = ?", [id_branch], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error : ".concat(err)));
        else
            res.status(200).end(true);
    });
};

/************************************************************/
/*                                                          */
/*                                                          */
/* Créer une nouvelle branche à partir du noeud selectionné */
/*                                                          */
/*                                                          */
/************************************************************/


/* let newBranch = (req, res) => {
    let branch_name = req.query.branch_name,
        id_node_cible = req.params.node,
        _project_path,
        i = 1;

    copydata.once('first_node', (id_node, id_branch) => {
        connection.query("UPDATE branch SET ? WHERE id = ?" [{
            id_first_node: id_node
        }, id_branch], (err) => {
            if (err)
                console.log(err);
        });
    });
    copydata.on('add', () => {
        i++;
    });
    copydata.on('data', (data) => {});
    copydata.on('error', (err) => {
        res.status(err.status).send(err.message);
    });
    copydata.on('end', () => {
        if (--i == 0) {
            res.status(200).send();
            copydata.removeAllListeners();
        }
    });
    promiseSQL.getRepoPathByNodeId(id_node_cible)
        .then((project) => {
            _project_path = project[0].path;
            return promiseSQL.getBranchByNodeId(id_node_cible)
        })
        .then((branch) => {
            createNodeBranch(id_node_cible, branch[0].id);
        })
        .catch(() => {
            res.status(500).send("Intern Error");
        })
        .done(() => {});
};

let createNodeBranch = (id_node, id_branch, repo_name) => {
    let _id_files3d,
        _node,
        files3d_name,
        path = uuid();
    promiseSQL.getFiles3dByNodeId(id_node)
        .then((files3d) => {
            files3d_name = files3d[0].name;
            return promiseSQL.newFiles3d(files3d[0].name, files3d[0].uuid)
        })
        .then((id_files3d) => {
            _id_files3d = id_files3d;
            return promiseSQL.getInfoNodeByNodeId(id_node);
        })
        .then((node) => {
            _node = node[0];
            return promiseSQL.newNode(node.name, path, node.id_project, _id_files3d, id_branch);
        })
        .then((id_node) => {
            copydata.emit('first_node', (id_node, id_branch));
            return new Promise((resolve, reject) => {
                add_node(repo_name, _node.name, files3d_name, datafiles3d, dataMtl, nameAuhor, mailAuthor, (err, results) => {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            });
        })
        .then((result) => {
            console.log(result);
            return promiseSQL.newCommit("[ADD] Node : " + _node.name, result.date, author, result.oid);
        })
        .then(() => {
            return promiseSQL.getNodeChildByNodeId(id_node);
        })
        .then((node) => {
            if (node instanceof Array) {
                node.forEach(function(child) {
                    copydata.emit('add');
                    recursive(child.id, id_branch, repo_name);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            copydata.emit('end');
        });
};
 */

/************************************************************/
/*                                                          */
/*                                                          */
/*            Fusionner une branche sur une autre           */
/*                                                          */
/*                                                          */
/************************************************************/

let merge = (req, res) => {
    let pull_request = req.params.pullrequest,
        validator = req.body.validator;

    promiseSQL.getBranchByPullRequestId(pull_request)
        .then((result) => {})
        .catch((err) => {
            res.status(err.status).send(err.message);
        })
        .done((result) => {
            res.status(200).send(result);
        });
};

/**
 * Get all branches informations by his id
 * @param {*} req
 * @param {*} res
 */
let getBranch = (req, res) => {
    let branchId = req.params.idBranch;

    connection.query("SELECT * FROM branch WHERE id = ? ", [branchId], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error"));
        else if (!results)
            res.status(400).end();
        else if (results.length == 0)
            res.send("There is no result");
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(results);
        }
    });
};


/************************************************************/
/*                                                          */
/*                                                          */
/*            Faire une recherche sur une branche           */
/*                                                          */
/*                                                          */
/************************************************************/
let search = (req, res) => {
    let username = req.query.username,
        password = req.query.password,
        data = "%" + req.query.data + "%";

    connection.query("SELECT branch.name FROM user, affectation, team, project, branch WHERE (user.username = ?) AND (user.password = ?) AND (affectation.id_user = user.id) AND (team.id = affectation.id_team) AND (project.id_team = team.id) AND (project.id = branch.id_project) AND (branch.name IN (SELECT name FROM branch WHERE name like ?)) ", [username, password, data], (err, results, fields) => {
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
    })
};

router.get('/api/branch/all/:projectId', [getAllBranchesByProject]);
router.get("/api/branch/node/:node", [getBranchByNodeBase]);
router.put("/api/branch/:branchId", [renameBranch]);
// router.delete("/api/deletebranch/:branch", [middControl.notMasterBranch, deleteNode, deleteBranch]);
router.put("/api/branch/pull_request/:pullrequest", [merge]);
router.get('/api/branch/:idBranch', [getBranch]);
router.get('/api/branch/search/user', [search]);

module.exports = router;