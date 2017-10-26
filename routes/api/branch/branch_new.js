const express = require("express"),
    EventEmmiter = require('events'),
    connection = require('../../../database/index'),
    router = express.Router(),
    promiseSQL = require('../utils/promiseSQL'),
    copydata = new EventEmmiter(),
    git_create_branch = require("../../../bucketgit/git_create_branch");

let new_branch = (req, res) => {
    let branch_name = req.params.branchName,
        id_node = req.params.idNode,
        i = 0;

    let getProjectPathByNodeId = (node) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT project.id, project.path FROM project, node, branch WHERE (project.id = branch.id_project) AND (branch.id = node.id_branch) AND (node.id = ?) ', [node], (err, results, fields) => {
                if (err) {
                    console.log("getProjectPath : ", err.sqlMessage);
                    reject(({
                        status: 500,
                        message: 'Internal Error'
                    }));
                } else if (!results)
                    reject(({
                        status: 404,
                        message: 'Not Found'
                    }));
                else if (results.length == 0)
                    reject(({
                        status: 404,
                        message: 'Not Found'
                    }));
                else
                    resolve(results);
            });
        });
    };

    copydata.once('first_node', (id_node, id_branch) => {
        connection.query("UPDATE branch SET id_first_node = ? WHERE id = ?", [id_node, id_branch], (err) => {
            if (err)
                console.log("first_node : ", err.sqlMessage);
        });
    });

    copydata.on('new_node', () => ++i);

    copydata.on('end_node', () => {
        if (--i == 0) {
            res.status(200).send();
            copydata.removeAllListeners();
        }
    });

    getProjectPathByNodeId(id_node)
        .then((project) => {
            _project = project[0];
            return promiseSQL.newBranch(null, branch_name, id_node, _project.id);
        })
        .then(id_branch => {
            _id_branch = id_branch;
            copydata.emit("new_node");
            makeNode(id_node, _id_branch, branch_name, null, _project.path);
        })
        .catch((err) => {
            console.log(err);
        })
        .done();
};

var promiseGetNodeChildByNodeIdWithoutError = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM node WHERE node_parent = ?", [id_node], (err, results, fields) => {
            if (err) {
                console.log("getNodeChild : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results || results.length == 0)
                resolve('Not Found');
            else
                resolve(results);
        });
    });
};

let promiseGetrights_fileByidNode = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM rights_file WHERE id_node = ?", [id_node], (err, results, fields) => {
            if (err) {
                console.log("getrights_fileByidNode : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results || results.length == 0)
                resolve('Not Found');
            else
                resolve(results);
        });
    });
}

let promiseCopyrights_fileByidNode = (rights_file, id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO rights_file SET ?", {
            read_right: rights_file.read_right,
            write_right: rights_file.write_right,
            id_affectation: rights_file.id_affectation,
            id_files3d: id_files3d,
            id_node: id_node
        }, (err) => {
            if (err) {
                console.log("CopyrightsByidNode : ", err.sqlMessage);
                reject('Internal Error');
            } else resolve();
        });
    });
};

let promiseGetrightsByidNode = id_node => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM rights WHERE id_node = ?", [id_node], (err, results, fields) => {
            if (err) {
                console.log("GetrightsByidNode : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results || results.length == 0)
                resolve('Not Found');
            else
                resolve(results);
        });
    });
};

let promiseCopyrightsByidNode = (rights, id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO rights SET ?", {
            administration: rights.administration,
            id_affectation: rights.id_affectation,
            id_node: id_node
        }, (err) => {
            if (err) {
                console.log("CopyrightsByidNode : ", err.sqlMessage);
                reject('Internal Error');
            } else resolve();
        });
    });
};


/**
 * Make a new Node recursively in the database + create a branch in each of the node in the git file associated
 *
 * @param {number} id_node
 * @param {number} id_branch
 * @param {String} branch_name
 * @param {number} node_parent
 * @param {String} project_path
 */
let makeNode = (id_node, id_branch, branch_name, node_parent, project_path) => {
    let _id_files3d,
        _node,
        new_node;

    promiseSQL.getFiles3dByNodeId(id_node)
        .then((files3d) => {
            return promiseSQL.newFiles3d(files3d[0].name, files3d[0].uuid);
        })
        .then((id_files3d) => {
            _id_files3d = id_files3d;
            return promiseSQL.getInfoNodeByNodeId(id_node);
        })
        .then((node) => {
            _node = node[0];
            return promiseSQL.newNode(_node.name, _node.path, _node.state_of_maturity, _node.is_intermediary, node_parent, _id_files3d, id_branch);
        })
        .then((node) => {
            new_node = node;
            copydata.emit('first_node', new_node, id_branch);
            git_create_branch(project_path, _node.path, branch_name);
        })
        .then(() => { return promiseGetrights_fileByidNode(id_node); })
        .then((rights_files) => {
            if (typeof(rights_files) !== 'string') {
                let promises = []
                rights_files.forEach(rights_file => {
                    promises.push(promiseCopyrights_fileByidNode(rights_file, _id_files3d, id_node));
                });
                return Promise.all(promises);
            }
        })
        .then(() => { return promiseGetrightsByidNode(id_node); })
        .then((array_rights) => {
            if (typeof(array_rights) !== 'string') {
                let promises = [];
                array_rights.forEach(rights => {
                    promises.push(promiseCopyrightsByidNode(rights, id_node));
                });
                return Promise.all(promises);
            }
        })
        .then(() => { return promiseGetNodeChildByNodeIdWithoutError(id_node); })
        .then(node => {
            if (typeof(node) !== 'string') {
                node.forEach(function(child) {
                    copydata.emit('add_node');
                    makeNode(child.id, id_branch, branch_name, new_node, project_path);
                });
            }
        })
        .catch(err => console.log(err))
        .done(() => copydata.emit('end_node'));
};

router.post('/api/branch/:idNode/:branchName', [new_branch]);

module.exports = router;