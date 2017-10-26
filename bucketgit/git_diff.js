const git = require('nodegit'),
    path = require('path'),
    Promise = require('promise'),
    open = Promise.nodeify(git.Repository.open),
    pathgit = require('./git_config');

/* ************************************************************************** */
/*                                                                            */
/*                       Nodegit Operation                                    */
/*                                                                            */
/* ************************************************************************** */

let diffFiles = (repoName, nodeName, fileName, commit) => {
    open(path.join(pathgit, repoName, '.git'))
        .then((repo) => {
            repo.getCommit(commit);
        })
        .then((commit) => {
            return commit.getDiff();
        })
        .then((diffList) => {
            diffList.forEach(function (diff) {
                diff.patches().then(function (patches) {
                    patches.forEach(function (patch) {
                        patch.hunks().then(function (hunks) {
                            hunks.forEach(function (hunk) {
                                hunk.lines().then(function (lines) {
                                    console.log("diff", patch.oldFile().path(), patch.newFile().path());
                                    console.log(hunk.header().trim());
                                    lines.forEach(function (line) {
                                        console.log(String.fromCharCode(line.origin()) + line.content().trim());
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
};

module.exports = diffFiles;