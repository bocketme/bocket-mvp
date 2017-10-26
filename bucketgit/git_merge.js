const git = require('nodegit'),
    path = require('path'),
    pathgit = require('./git_config'),
    Promise = require('promise'),
    open = Promise.nodeify(git.Repository.open);

/**
 *
 *
 * @param {String} repo_path
 * @param {String} node_path
 * @param {String} base_branch
 * @param {String} compare_branch
 */
module.exports = (repo_path, node_path, base_branch, compare_branch) => {
    let repository = path.join(pathgit, repo_path, node_path, '.git'),
        ourCommit,
        _repo,
        theirCommit;
    console.log(repository);
    open(repository)
        .then(repo => {
            _repo = repo;
            return _repo.getBranchCommit(base_branch);
        })
        .then(commit => {
            ourCommit = commit;
            return _repo.getBranchCommit(compare_branch);
        })
        .then(commit => {
            theirCommit = commit;
            return new git.MergeOptions({

            });
        })
        .then((MergeOptions) => git.Merge.commits(_repo, ourCommit, theirCommit))
        .then(function (index) {
            if (!index.hasConflicts()) {
                return index.writeTreeTo(_repo);
            }
        })
        .then(oid => {
            return _repo.createCommit(
                ourCommit.name,
                _repo.defaultSignature(),
                _repo.defaultSignature(),
                "[MERGE] : ".concat(compare_branch).concat(" to ").concat(base_branch),
                oid, [ourCommit, theirCommit]);
        })
        .then(() => {
            return _repo.getBranch(base_branch);
        })
        .then((branch) => git.Branch.delete(branch))
        .catch(err => console.log(err))
        .done();
};