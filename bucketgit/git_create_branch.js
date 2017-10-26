const git = require('nodegit'),
    path = require('path'),
    Promise = require('promise'),
    open = Promise.nodeify(git.Repository.open),
    pathgit = require('./git_config');

/**
 * Create a nex branch
 *
 * @param {String} repoName
 * @param {String} nodeName
 * @param {String} branchName
 */
let new_branch = (repoName, nodeName, branchName, oid) => {
    let pathToNode = path.join(pathgit, repoName, nodeName, '.git'),
        _repo;
    open(pathToNode)
        .then(repo => {
            _repo = repo;
            if (oid) return git.Commit.lookup(_repo, oid);
            else return _repo.getHeadCommit();
        })
        .then(commit => _repo.createBranch(branchName, commit, 0, _repo.defaultSignature(), "[New] Branch : " + branchName))
        .catch(err => console.log(err))
        .done();
};

module.exports = new_branch;