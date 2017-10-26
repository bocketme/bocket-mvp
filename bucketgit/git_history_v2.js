const git = require('nodegit'),
    path = require('path'),
    open = Promise.nodeify(git.Repository.open),
    pathgit = require('./git_config'),
    EventEmmiter = require('events');


/* ************************************************************************** */
/*                                                                            */
/*              Git History V2 (build) - Destroy the parasite commits         */
/*                                                                            */
/* ************************************************************************** */

let verificatorObj = (ArrayOfThree) => {
    console.log("hey");
    ArrayOfThree.forEach(function (three) {
        console.log("tree =", three);
    });
};

/* ************************************************************************** */
/*                                                                            */
/*                       Nodegit Operation                                    */
/*                                                                            */
/* ************************************************************************** */


let commitHistory = (repoName, nodeName, fileName, callback) => {
    open(path.join(pathgit, repoName, nodeName, '.git'))
        .then((repo) => {
            return repo.getMasterCommit();
        })
        .then(function (firstCommitOnMaster) {
            var history = firstCommitOnMaster.history(git.Revwalk.SORT.Time);
            var commits = [];
            history.on("commit", function (commit) {
                commits.push(commit.getThree());
            });
            history.start();
            return new Promise((resolve, reject) => {
                history.on("end", () => {
                    resolve(Promise.all(commits));
                });
                history.on("error", (err) => {
                    reject(err);
                });
            });
        })
        .then(ArrayOfThree => {
            console.log(ArrayOfThree);
            return verificatorObj(ArrayOfThree);

        })
        .catch(err => {
            return (callback(err));
        })
        .done(callback => {
            return callback;
        });
};

// oid: commit.sha(),
// name: commit.author().name(),
// email: commit.author().email(),
// date: commit.date(),
// message: commit.message()


commitHistory('babou', 'master', 'babou.obj', (err, result) => {
    if (err)
        console.log("err = ", err);
    else
        console.log(result);
});

module.exports = commitHistory;