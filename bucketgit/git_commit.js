let git = require('nodegit'),
    path = require('path'),
    open = git.Repository.open,
    pathgit = require('./git_config'),
    fs = require('fs');

var writeFile = (repoName, nodeName, filename, callback) => {
    var pathToFile = path.join(pathgit, repoName, nodeName, 'files3D', filename),
        ressources = path.join(pathgit, 'ressources', filename);

    fs.stat(ressources, (err, stat) => {
        if (err)
            return callback(err);

        fs.open(pathToFile, 'w', (err) => {
            if (err)
                return callback(err);

            var read = fs.createReadStream(ressources),
                write = fs.createWriteStream(pathToFile);

            read.on('error', (err) => {
                return callback(err);
            });
            read.pipe(write);
            write.on('finish', () => {
                // console.log(filename, "a été copié dans le chemin : ", pathToFile);
                return callback(null);
            });
            write.on("error", (err) => {
                return callback(err);
            });
        });
    });
};

/* ************************************************************************** */
/*                                                                            */
/*                                 Promise                                    */
/*                                                                            */
/* ************************************************************************** */

var promisify_writefile = require('./utils/promise_write_file');


/**
 * Commit from the browser.
 *
 * @param {String} nameFile - Name's file
 * @param {String} typefile - Type's file
 * @param {String} dataFile - Data's file
 * @param {String} nameRepo - Name's Repository
 * @param {String} nameNode - Name's node
 * @param {String} nameAuthor - Name's Author
 * @param {String} mailAuthor - Mail's Author
 * @param {Fucntion} callback - callback
 */
var commitBrowser = (nameFile, typefile, dataFile, nameRepo, nameNode, message, nameAuthor, mailAuthor, callback) => {
    var pathToRepo = path.join(pathgit, nameRepo),
        pathTofile = path.join(pathToRepo, nameNode, nameFile),
        _repo, _index, _oid, date, time_zone;
    open(path.join(pathgit, nameRepo, nodeName, '.git'))
        .then((repo) => {
            _repo = repo;
        })
        .then(() => {
            return promisify_writefile(pathTofile.concat(type), dataFile);
        })
        .then(() => {
            return _repo.refreshIndex();
        })
        .then((index) => {
            _index = index;
        })
        .then(() => {
            return _index.addByPath(nameFile + typefile);
        })
        .then(() => {
            return _index.write();
        })
        .then(() => {
            return _index.writeTree();
        })
        .then((oid) => {
            _oid = oid;
            return git.Reference.nameToId(_repo, "HEAD");
        })
        .then((head) => {
            return _repo.getCommit(head);
        })
        .then((parent) => {
            _oid = oid;
            date = Date.now();
            var tpmDate = new Date();
            time_zone = tpmDate.getTimezoneOffset();
            var author = git.Signature.create(nameAuthor, authorMail, date, time_zone);
            return _repo.createCommit("HEAD", author, author, message, _oid, [parent]);
        })
        .then((commitID) => {
            return callback(null, commitID);
        })
        .catch((err) => {
            return callback(err);
        })
        .done((callback) => {
            return callback;
        });
};

// Commit on branch
let commit = (nameFile, typefile, dataFile, nameRepo, nameNode, branchname, message, nameAuthor, mailAuthor, callback) => {

};

module.exports = {
    write: writeFile,
    browser: commitBrowser,
    // writedata: writeFileWithData
};