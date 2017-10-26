const git = require('nodegit'),
    path = require('path'),
    Promise = require('promise'),
    init = Promise.nodeify(git.Repository.init),
    pathgit = require('./git_config');


/* ************************************************************************** */
/*                                                                            */
/*                                 Promise                                    */
/*                                                                            */
/* ************************************************************************** */

var promsify_directory = require('./utils/promise_directory'),
    promsify_writefile = require('./utils/promise_write_file');


/* ************************************************************************** */
/*                                                                            */
/*                       Nodegit Operation                                    */
/*                                                                            */
/* ************************************************************************** */


/**
 * Add a node (git Directory) in a specific repository.
 *
 * @param   {String}    repoName -
 * @param   {String}    nodeName
 * @param   {String}    files3dName
 * @param   {String}    nameAuthor
 * @param   {String}    mailAuthor
 * @param   {Function}  callback
 * @return  {Function}
 */
var add_node = (repoName, nodeName, files3dName, dataOBJ, dataMTL, nameAuthor, mailAuthor, callback) => {
    var _repo, _index, date, time_zone, _oid, message;

    init(path.join(pathgit, repoName, nodeName), 0)
        .then((repo) => {
            _repo = repo;
        })
        .then(() => {
            return promsify_writefile(path.join(pathgit, repoName, nodeName, files3dName.concat('.mtl')), dataOBJ);
        })
        .then(() => {
            return promsify_writefile(path.join(pathgit, repoName, nodeName, files3dName.concat('.obj')), dataMTL);
        })
        .then(() => {
            return _repo.refreshIndex();
        })
        .then((index) => {
            _index = index;
        })
        .then(() => {
            return _index.addByPath(files3dName.concat('.obj'));
        })
        .then(() => {
            return _index.addByPath(files3dName.concat('.mtl'));
        })
        .then(() => {
            return _index.write();
        })
        .then(() => {
            return _index.writeTree();
        })
        .then((oid) => {
            message = "[NEW] nodeChild : " + nodeName;;
            _oid = oid;
            date = Date.now();
            var tpmDate = new Date();
            time_zone = tpmDate.getTimezoneOffset();
            return git.Signature.create(nameAuthor, authorMail, date, time_zone);
        })
        .then((author) => {
            return _repo.createCommit("HEAD", author, author, message, _oid, []);
        })
        .then((commitId) => {
            return callback(null, {
                oid: commitId.sha(),
                date: date,
                time_zone: time_zone
            });
        })
        .catch(err => {
            return callback(err);
        })
        .done((callback) => {
            return callback;
        });
};

module.exports = add_node;