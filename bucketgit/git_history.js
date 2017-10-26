const git = require('nodegit'),
    path = require('path'),
    Promise = require('promise'),
    open = Promise.nodeify(git.Repository.open),
    pathgit = require('./git_config');

let commitHistory = (repoName, nodeName, callback) => {
    open(path.join(pathgit, repoName, nodeName, '.git'))
        .then((repo) => {
            return repo.getMasterCommit();
        })
        .then(function (firstCommitOnMaster) {
            var history = firstCommitOnMaster.history(git.Revwalk.SORT.Time);
            var commits = [];
            history.on("commit", function (commit) {
                commits.push({
                    oid: commit.sha(),
                    name: commit.author().name(),
                    email: commit.author().email(),
                    date: commit.date(),
                    message: commit.message()
                });
            });
            history.start();
            return new Promise((resolve, reject) => {
                history.on("end", () => {
                    resolve(callback(null, commits));
                });
                history.on("error", (err) => {
                    reject(err);
                });
            });
        })
        .catch(err => {
            return (callback(err));
        })
        .done((callback) => {
            return callback;
        });
};

module.exports = commitHistory;