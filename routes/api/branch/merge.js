const express = require("express"),
    EventEmmiter = require('events'),
    connection = require('../../../database/index'),
    router = express.Router(),
    mergeEvent = new EventEmmiter(),
    promiseSQL = require('../utils/promiseSQL'),
    git_merge = require("../../../bucketgit/git_merge");

let merge = (req, res) => {
    let id_pull_request = req.params.pullrequest,
        _pull_request, _branch_source, _branch_destination,
        i = 0,
        j = 0;

    mergeEvent.on('destroy_nodes', () => ++j);
    mergeEvent.on('end_nodes', () => {
        if (--j == 0) {
            mergeEvent.emit('end');
        }
    });
    mergeEvent.on('merge_branch', () => ++i);
    mergeEvent.on('end_branch', () => {
        if (--i == 0) {
            console.log('branch mergé');
            destroy_branch();
        }
    });
    mergeEvent.on('end', () => {
        mergeEvent.removeAllListeners();
        res.end();
    });
    promiseSQL.getPullRequestById(id_pull_request)
        .then(pull_request => {
            _pull_request = pull_request[0];
            return promiseSQL.getBranchById(_pull_request.branch_source)
        })
        .then((branch_source) => {
            _branch_source = branch_source;
            return promiseSQL.getBranchById(_pull_request.branch_destination)
        })
        .then((branch_destination) => {
            _branch_destination = branch_destination;
            return promiseSQL.getProjectByIdBranch(_pull_request.branch_source);
        })
        .then((project) => {
            mergeEvent.emit('merge_branch');
            return merge_branch(_branch_source.name, _branch_destination.name, project[0].path, _branch_source.id_base_node);
        })
        .catch((err) => {
            console.log(err);
        });
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

let destroy_branch = (id_node) => {
    promiseSQL.getNodeChildByNodeId(id_node)
        .then(nodes => {
            mergeEvent.emit('destroy_node');
            if (typeof (nodes) !== 'string') {
                let promises = new Array();
                nodes.forEach(child => {
                    promises.push(destroy_branch(child.id))
                });
                return Promise.all(promises);
            } else return (null);
        })
        .then(() => {
            return promiseSQL.deleteNode(id_node);
        })
        .catch(err => {
            console.log(err);
        })
        .done(() => {
            mergeEvent.emit('end_nodes');
            return new Promise((resolve) => {
                resolve();
            });
        });
};

let merge_branch = (branch_source, branch_destination, repo_path, node_id) => {
    console.log(node_id);
    promiseSQL.getInfoNodeByNodeId(node_id)
        .then(node => git_merge(repo_path, node[0].path, branch_source, branch_destination))
        .then(() => {
            return promiseGetNodeChildByNodeIdWithoutError(node_id);
        })
        .then(nodes => {
            if (typeof (nodes) !== 'string') {
                nodes.forEach(function (child) {
                    mergeEvent.emit('merge_branch');
                    merge_branch(branch_source, branch_destination, repo_path, child.id);
                });
            }
        })
        .then(() => {})
        .catch()
        .done(() => mergeEvent.emit('end_branch'));
};

router.post('/api/branch/merge/:pullrequest', [merge]);
module.exports = router;