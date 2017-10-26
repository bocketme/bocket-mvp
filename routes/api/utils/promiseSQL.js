const connection = require('../../../database/index'),
    Promise = require('promise');

let promisegetTeam = (name_team, id_organization) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM team where (name = ?) AND (id_owner = ?)", [name_team, id_organization], (err, results, fields) => {
            if (err) {
                console.log("promisegetTeam : ", err.sqlMessage);
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

let promiseNewFiles3d = (name, uuid) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO files3d SET ?", {
            name: name,
            uuid: uuid
        }, (err, results, fields) => {
            if (err) {
                console.log("promiseNewFiles3d : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        });
    });
};

let promiseGetFiles3dByNodeId = (node_id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT files3d.name, files3d.uuid FROM files3d, node where (node.id = ?) AND (node.id_files3d = files3d.id)", [node_id], (err, results, fields) => {
            if (err) {
                console.log("promiseGetFiles3dByNodeId : ", err.sqlMessage);
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

/**
 * Create a new Project
 *
 * @param {String} name
 * @param {String} description
 * @param {String} path
 * @param {String} id_organization
 * @param {String} id_team
 * @returns {Promise}
 */
let promiseNewProject = (name, description, path, id_organization, id_team) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO project SET ?", {
            name: name,
            path: path,
            description: description,
            id_organization: id_organization,
            id_team: id_team,
        }, (err, results, fields) => {
            if (err) {
                console.log("promiseNewProject :", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        });
    });
};

/**
 * Set the first_node's branch
 *
 * @param {Number} id_master_branch
 * @param {Number} id_project
 * @returns
 */
let promiseSetBranchProject = (id_master_branch, id_project) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE project SET ? WHERE id = ?", [{
            id_master_branch: id_master_branch
        }, id_project], (err, results, fields) => {
            if (err) {
                console.log("promiseSetBranchProject :", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else
                resolve();
        });
    });
};

/**
 * Set the first_node's branch
 *
 * @param {any} id_first_node
 * @param {any} id_node
 * @returns
 */
let promiseSetNodesBranch = (id_first_node, id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE branch SET ? WHERE id = ?", [{
            id_first_node: id_first_node
        }, id_node], (err, results, fields) => {
            if (err) {
                console.log("promiseSetNodeBranch :", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else
                resolve();
        });
    });
};

/**
 * Create a new Branch
 *
 * @param {String} id_first_node
 * @param {String} name
 * @param {String} id_project
 * @returns
 */
let promiseNewBranch = (id_first_node, name, base_node, id_project) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO branch SET ?", {
            id_first_node: id_first_node,
            name: name,
            id_base_node: base_node,
            id_project: id_project
        }, (err, results, fields) => {
            if (err) {
                console.log("promiseNewBranch : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        })
    });
};

let promiseSetintermediaryByNodeId = (is_intermediary, id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE node SET ? WHERE id = ?", [{
            is_intermediary: is_intermediary
        }, id_node], (err) => {
            if (err) {
                console.log("promiseNewNode : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        });
    });
};

/**
 * Create a new Node
 *
 * @param {String} name
 * @param {String} path
 * @param {String} state_of_maturity
 * @param {String} is_intermediary
 * @param {String} node_parent
 * @param {String} id_files3d
 * @param {String} id_branch
 * @returns {Promise}
 */
let promiseNewNode = (name, path, state_of_maturity, is_intermediary, node_parent, id_files3d, id_branch) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO node SET ?", {
            name: name,
            path: path,
            is_intermediary: is_intermediary,
            node_parent: node_parent,
            state_of_maturity: state_of_maturity,
            id_files3d: id_files3d,
            id_branch: id_branch
        }, (err, results, fields) => {
            if (err) {
                console.log("promiseNewNode : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        });
    });
};

/**
 *
 *
 * @param {String} id_team
 * @returns {Promise}
 */
let promisegetAuthorByOwnerTeam = (id_team) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT user.id, user.username, user.email FROM user, affectation, team WHERE (user.id = affectation.id_user) AND (affectation.owner_team = ?) AND (affectation.id_team = team.id) AND (team.id = ?)", [true, id_team], (err, results, fields) => {
            console.log(results);
            if (err) {
                console.log("promisegetAuthorByOwnerTeam : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else if (!results)
                reject(({
                    status: 404,
                    message: 'Team Not Found'
                }));
            else if (results.length == 0)
                reject(({
                    status: 404,
                    message: 'Team Not Found'
                }));
            else
                resolve(results);
        });
    });
};

let promiseNewCommit = (title, date_of_commit, author, oid, id_files3d) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO commit SET ?", {
            title: title,
            date_of_commit: date_of_commit,
            author: author,
            git_oid: oid,
            id_files3d: id_files3d
        }, (err, results, fields) => {
            if (err) {
                console.log("promiseNewCommit : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else
                resolve(results.insertId);
        });
    });
};

var promiseGetNodeChildByNodeId = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM node WHERE node_parent = ?", [id_node], (err, results, fields) => {
            if (err) {
                console.log("getNodeChild : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results)
                reject('Not Found');
            else if (results.length == 0)
                reject('Not Found');
            else
                resolve(results);
        });
    });
};

/**
 * Get the Pull_request by his id
 *
 * @param {Number} id_pullrequest
 * @returns {Promise}
 */
let promiseGetPullRequestById = id_pullrequest => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM pull_request WHERE id = ?", [id_pullrequest], (err, results, fields) => {
            if (err) {
                console.log("getNodeChild : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results || results.length == 0)
                reject('Not Found');
            else
                resolve(results);
        });
    });
};

let promiseGetProjectByIdBranch = id_branch => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT project.* FROM project, branch WHERE (branch.id = ?) AND (project.id = branch.id_project);", [id_branch], (err, results, fields) => {
            if (err) {
                console.log("getProjectByIdBranch : ", err.sqlMessage);
                reject('Internal Error');
            } else if (!results || results.length == 0)
                reject('Not Found');
            else
                resolve(results);
        });
    });
};

let promiseGetNodeParent = (node_parent) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT branch.id, project.id FROM node, project, branch WHERE (node.id = ?) ", [node_parent], (err, results, fields) => {
            if (err) {
                console.log("promiseGetNodeParent : ", err.sqlMessage);
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

let promiseGetBranchByNodeId = (node_id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT branch.id FROM node, branch WHERE node.id = ?", [node_id], (err, results, fields) => {
            if (err) {
                console.log("promiseGetBranchByNodeId : ", err.sqlMessage);
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

let promiseGetRepoPathByNodeId = (node_id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT project.path FROM project, node, branch WHERE (node.id = ?) AND (project.id = branch.id_project) AND (node.id_branch = branch.id)  ", [node_id], (err, results, fields) => {
            if (err) {
                console.log("promiseGetBranchByPullRequest : ", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else if (!results)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else if (results.length == 0)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else
                resolve(results);
        });
    });
};

let promiseGetBranchByPullRequest = (id_pullrequest) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT branch.id_first_node, branch.id_base_node pull_request.branch_destination FROM pull_request, branch WHERE (pull_request.branch_source = branch.id) AND (pull_request.id = ?)", [id_pullrequest], (err, results, fields) => {
            if (err) {
                console.log("promiseGetBranchByPullRequest : ", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else if (!results)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else if (results.length == 0)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else
                resolve(results);
        });
    });
};

let promiseGetBranchesByProjectId = (id_project) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT branch.* FROM branch, project WHERE (project.id = branch.id_project) AND (project.id = ?)", [id_project], (err, results, fields) => {
            if (err) {
                console.log("getBranchesByProjectId : ", err.sqlMessage);
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            } else if (!results)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else if (results.length == 0)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else
                resolve(results);
        });
    });
};

let promiseGetNodeByBranchId = (id_branch) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * From node WHERE id_branch = ?", [id_branch],
            (err, results, fields) => {
                if (err) {
                    console.log("getNodeByBranchId : ", err.sqlMessage);
                    reject({
                        status: 500,
                        message: 'Internal Error'
                    });
                } else if (!results)
                    reject({
                        status: 404,
                        message: 'Not Found'
                    });
                else if (results.length == 0)
                    reject({
                        status: 404,
                        message: 'Not Found'
                    });
                else
                    resolve(results);
            });
    });
};

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
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else if (results.length == 0)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else {
                resolve(results);
            }
        });
    })
};

let promiseGetNodeById = (nodeId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM node WHERE id = ?', [nodeId], (error, results) => {
            if (error) reject({
                message: error,
                status: 500
            });
            console.log('[PromiseSql] getNodeId : ', results[0]);
            resolve(results[0]);
        });
    });
};

let promiseGetBranchById = (branchId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM branch WHERE id = ?', [branchId], (err, results) => {
            if (err) {
                console.log('[PromiseSql] getNodeId : ', results[0]);
                reject({
                    message: "Intern Error",
                    status: 500
                });
            } else if (!results || results.length == 0)
                reject({
                    message: "Not Found",
                    status: 404
                });
            else
                resolve(results[0]);
        })
    })
};

let promiseGetNodeComments = (idNode) => {
    return new Promise((res, rej) => {
        connection.query('SELECT * FROM comments WHERE id_node = ?', [idNode], (err, result) => {
            if (err)
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            res(result);
        })
    });
};

let promiseGetUser = (userId) => {
    return new Promise((res, rej) => {
        connection.query('SELECT * FROM user WHERE id = ?', [userId], (err, result) => {
            if (err)
                rej(({
                    status: 500,
                    message: 'Internal Error'
                }));
            res(result[0]);
        })
    })
};

let promiseDeleteNode = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM node WHERE id = ?', [id_node], (err, results) => {
            if (err) {
                console.log('[PromiseSql] promiseDeleteNode : ', results[0]);
                reject(err);
            } else resolve();
        });
    });
};

module.exports = {
    newCommit: promiseNewCommit,
    newFiles3d: promiseNewFiles3d,
    getIDTeam: promisegetTeam,
    newNode: promiseNewNode,
    newProject: promiseNewProject,
    newBranch: promiseNewBranch,
    getAuthor: promisegetAuthorByOwnerTeam,
    setNodesBranch: promiseSetNodesBranch,
    getNodeParent: promiseGetNodeParent,
    getBranchByNodeId: promiseGetBranchByNodeId,
    getBranchByPullRequestId: promiseGetBranchByPullRequest,
    getNodeById: promiseGetNodeById,
    getFiles3dByNodeId: promiseGetFiles3dByNodeId,
    getNodeChildByNodeId: promiseGetNodeChildByNodeId,
    getRepoPathByNodeId: promiseGetRepoPathByNodeId,
    getInfoNodeByNodeId: promiseGetInfoNodeByNodeId,
    setintermediaryByNodeId: promiseSetintermediaryByNodeId,
    getBranchesByProjectId: promiseGetBranchesByProjectId,
    getNodeByBranchId: promiseGetNodeByBranchId,
    getBranchById: promiseGetBranchById,
    setBranchProject: promiseSetBranchProject,
    getNodeComments: promiseGetNodeComments,
    getUser: promiseGetUser,
    getPullRequestById: promiseGetPullRequestById,
    getProjectByIdBranch: promiseGetProjectByIdBranch,
    deleteNode: promiseDeleteNode
};