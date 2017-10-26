const git = require('nodegit'),
    path = require('path'),
    pathgit = require('./git_config'),
    Promise = require('promise'),
    open = Promise.nodeify(git.Repository.open),
    fse = require('fs-extra');


let promisify_readfile = require('./utils/promise_read_file');


let commit = (repoName, filename, nodeName, type, oid, callback) => {
    let _entry,
        pathToRepo = path.join(pathgit, repoName, ".git");
    open(pathToRepo)
        .then((repo) => {
            if (oid)
                return repo.getCommit(oid);
            else return repo.getHeadCommit();
        })
        .then((commit) => {
            return commit.getEntry(path.join(nodeName, filename + type));
        })
        .then((entry) => {
            _entry = entry;
            return _entry.getBlob();
        })
        .catch((err) => {
            return callback(err);
        })
        .done((blob) => {
            return callback(null, {
                filename: _entry.name(),
                oid: _entry.sha(),
                filesize: blob.rawsize().concat('b'),
                data: blob.toString()
            });
        });
};


/**
 *
 *
 * @param {String} repoName
 * @param {String} filename
 * @param {String} nodeName
 * @param {Function} callback
 */
let read = (repoName, filename, nodeName, callback) => {
    let pathToFile = path.join(pathgit, repoName, nodeName, filename);

    promisify_readfile(pathToFile)
        .then((data) => {
            return callback(null, data);
        })
        .catch((err) => {
            return callback(err);
        })
        .done((callback) => {
            return callback;
        });
};


/**
 * Pour le developpement uniquement - pour l'environnement de test du viewer (celui avec toutes les ressources).
 *
 * @param {String} repoName
 * @param {String} filename
 * @param {String} nodeName
 * @param {Function} callback
 */
let read_only = (repoName, filename, nodeName, callback) => {
    let pathToFile = path.join(pathgit, repoName, nodeName, "files3D", filename);
    promisify_readfile(pathToFile)
        .then((data) => {
            return callback(null, data);
        })
        .catch((err) => {
            return callback(err);
        })
        .done((callback) => {
            return callback;
        });
};

module.exports = {
    commit: commit,
    read_only: read_only,
    read: read
};