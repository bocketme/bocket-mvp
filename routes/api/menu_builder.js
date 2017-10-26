const express = require("express"),
    Promise = require('promise'),
    router = express.Router(),
    connection = require('../../database/index'),
    promiseSQL = require('./utils/promiseSQL'),
    EventEmmiter = require('events');

/**
 *
 *
 * @param {any} nodeId
 * @returns
 */
let promiseGetIdNodeChildByNodeId = (nodeId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM node WHERE node_parent = ?", [nodeId], (err, results, fields) => {
            if (err) {
                console.log("getNodeChild : ", err.sqlMessage);
                reject(err.sqlMessage);
            } else if (!results || results.length == 0)
                resolve();
            else
                resolve(results);
        });
    });
};

/**
 *
 *
 * @param {any} id_node
 * @returns
 */
let promiseGetInfoNodeByNodeId = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM node WHERE id = ?", [id_node], (err, results, fields) => {
            if (err) {
                console.log("getNodeChild : ", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else if (!results)
                resolve();
            else {
                resolve(results);
            }
        });
    });
};



/**
 *
 *
 * @param {any} id_node
 * @callback
 */
let buildernode = (id_node, callback) => {
    let _node = new Object(),
        nodeConstructor = new EventEmmiter();

    promiseGetInfoNodeByNodeId(id_node)
        .then(node => {
            _node = new Object(node[0]);
            return promiseGetIdNodeChildByNodeId(id_node);
        })
        .then((ids) => {
            if (typeof(ids) == "object") {
                let constructor = new Array();
                nodeConstructor.on("add", value => {
                    if (value)
                        constructor.push(value);
                    nodeConstructor.emit("end");
                });
                nodeConstructor.on("add", (data) => {});
                let count_ids = ids.length;
                ids.forEach(node => {
                    buildernode(node.id, (err, result) => {
                        if (err)
                            nodeConstructor.emit("add", null);
                        else
                            nodeConstructor.emit("add", result);
                    });
                });
                return new Promise((resolve) => {
                    nodeConstructor.on("end", () => {
                        if (--count_ids == 0)
                            resolve(constructor);
                    });
                });
            } else return null;

        })
        .then(node_child => {
            if (node_child)
                _node.child = node_child;
            return callback(null, _node);
        })
        .catch((err) => {
            console.log(err);
            return callback(err);
        })
        .done();
};

router.get("/api/menu_build/:idProject", (req, res) => {
    let id_project = req.params.idProject,
        data = new Array(),
        count_branch = 0;

    let branchNodes = new EventEmmiter();

    branchNodes.on("new_branch", (branch) => {
        ++count_branch;
        buildernode(branch.id_first_node, (err, node_build) => {
            if (err)
                branchNodes.emit("error", err);
            else {
                let result = new Object(branch);
                result.nodes = node_build;
                data.push(result);
                branchNodes.emit("end_branch");
            }
        });
    });
    branchNodes.on("error", () => {
        res.status(500).send("Intern Error");
        branchNodes.removeAllListeners();
    });
    branchNodes.on("end_branch", () => {
        if (--count_branch == 0) {
            res.send(data);
            branchNodes.removeAllListeners();
        }
    });
    promiseSQL.getBranchesByProjectId(id_project)
        .then((branches) => {
            branches.forEach((branch) => {
                branchNodes.emit("new_branch", branch);
            });
        })
        .catch(err => {
            console.log("err = ", err);
            res.status(404).send("Not Found");
            branchNodes.removeAllListeners();
        })
        .done();
});

router.get("/api/menu_build/branch/:branch", (req, res) => {
    let branchId = req.params.branch,
        data = new Array();
    promiseSQL.getBranchById(branchId)
        .then(branch => {
            return new Promise((resolve, reject) => {
                buildernode(branch.id_first_node, (err, node_build) => {
                    if (err)
                        reject({ message: "Intern Error", status: 500 })
                    else {
                        let result = new Object(branch);
                        result.nodes = node_build;
                        data.push(result);
                        resolve(data);
                    }
                });
            });
        })
        .then(data => res.send(data))
        .catch((err) => {
            console.log(err);
            res.status(err.status).send(err.message)
        })
        .done();
});
module.exports = router;