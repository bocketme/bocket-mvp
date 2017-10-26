let git = require('nodegit'),
    path = require('path'),
    Promise = require('promise'),
    init = Promise.nodeify(git.Repository.init),
    pathgit = require('./git_config');

/* ************************************************************************** */
/*                                                                            */
/*                                 Promise                                    */
/*                                                                            */
/* ************************************************************************** */

var promisify_directory = require('./utils/promise_directory'),
    promisify_writefile = require('./utils/promise_write_file');

/* ************************************************************************** */
/*                                                                            */
/*                           Nodegit Command                                  */
/*                                                                            */
/* ************************************************************************** */


/**
 * Initialize the repository
 *
 * @param {String} repoName - Repository's name.
 * @param {any} nodeName - Node's name
 * @param {String} authorMail - User's mail.
 * @param {String} nameAuthor - Author's name.
 * @callback
 */
var ini = (repoName, nodeName, namefile, authorMail, nameAuthor, callback) => {
    let pathToRepo = path.join(pathgit, repoName),
        _repo, date, time_zone, _oid;

    promisify_directory(pathToRepo)
        .then(() => {
            return promisify_directory(pathToRepo.concat('_specFiles'));
        })
        .then(() => {
            return promisify_directory(path.join(pathToRepo.concat('_specFiles'), nodeName));
        })
        .then(() => {
            return init(path.join(pathToRepo, nodeName), 0);
        })
        .then((repo) => {
            _repo = repo;
        })
        .then(() => {
            return promisify_writefile(path.join(pathToRepo, nodeName, namefile.concat(".obj")), null);
        })
        .then(() => {
            return promisify_writefile(path.join(pathToRepo, nodeName, namefile.concat(".mtl")), null);
        })
        .then(() => {
            return _repo.refreshIndex();
        })
        .then((index) => {
            _index = index;
        })
        .then(() => {
            return _index.addByPath(namefile.concat(".obj"));
        })
        .then(() => {
            return _index.addByPath(namefile.concat(".mtl"));
        })
        .then(() => {
            return _index.write();
        })
        .then(() => {
            return _index.writeTree();
        })
        .then((oid) => {
            _oid = oid;
            date = new Date();
            let tpmDate = date.getTime();
            time_zone = date.getTimezoneOffset();
            author = git.Signature.create(nameAuthor, authorMail, tpmDate, time_zone);
            return author;
        })
        .then((author) => {
            return _repo.createCommit("HEAD", author, author, "[NEW] PROJECT " + repoName, _oid, []);
        })
        .then((commitId) => {
            let oid = commitId.toString();
            return callback(null, {
                oid: oid,
                date: date,
                time_zone: time_zone
            });
        })
        .catch(err => {
            console.log(err);
            return callback(err);
        })
        .done((callback) => {
            return callback;
        });
};

module.exports = ini;