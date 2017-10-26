const git = require('nodegit'),
    path = require('path'),
    open = Promise.nodeify(git.Repository.open),
    pathgit = require('./git_config');

/* ************************************************************************** */
/*                                                                            */
/*                               Promise                                      */
/*                                                                            */
/* ************************************************************************** */

var promisify_rmdir = require('./utils/promise_remove_directory');

/* ************************************************************************** */
/*                                                                            */
/*                       Nodegit Operation                                    */
/*                                                                            */
/* ************************************************************************** */
/*
var remove_node = (repoName, nodeName, nameAuthor, callback) => {
    let _repo, _index, date, time_zone, _oid, _commitId;

    open(path.join(pathgit, repoName, '.git'))
        .then((repo) => {
            if (repo)
                _repo = repo;
            else
                Promise.reject("Couldn't find the repo.");
        })
        .then(() => { return _repo.refreshIndex(); })
        .then((index) => {
            if (index)
                _index = index;
            else
                Promise.reject("Couldn't create an index");
        })
        .then(() => { return _index.removebyPath(); })
        .then(() => { return _index.write(); })
        .then(() => { return _index.writeTree(); })
        .then((oid) => {
            if (oid) {
                _oid = oid;
                return nodegit.Reference.nameToId(_repository, "HEAD");
            } else
                Promise.reject("Couldn't create the oid");
        })
        .then(function(parent) {
            var author = git.

            return _repository.createCommit("HEAD", author, committer,
                "message", _oid, [parent]);
        })
        .then((head) => { return _repo.getCommit(head); })
        .then((parent) => {
            date = Date.now();
            var tpmDate = new Date();
            time_zone = tpmDate.getTimezoneOffset();
            var author = git.Signature.create(nameAuthor, mailAuthor, date, time_zone);
            return repo.createCommit("HEAD", author, author, commiter, "[NEW] nodeChild : " + nodeName, oid, [parent]);
        })
        .then((commitId) => {
            if (commitId) {
                _commitId = commitId
                return promisify_rmdir(path.join(pathgit, repoName, nodeName));
            } else Promise.reject("Couldn't create the commitId");
        })
        .catch((err) => {
            callback(err);
        })
        .done(() => {
            callback(null, {
                files3dName: files3dName,
                nameAuthor: nameAuthor,
                mailAuthor: mailAuthor,
                repoName: repoName,
                nodeName: nodeName,
                oid: _commitId,
                date: date,
                time_zone: time_zone
            });
        });
};
 */
let remove_node = (repoName, nodeName, callback) => {
    promisify_rmdir(path.join(pathgit, repoName, nodeName))
        .catch((err) => {
            return callback(err);
        })
        .done(() => {
            return callback(null);
        });
};
module.exports = remove_node;