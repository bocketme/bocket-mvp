 const pathgit = require('./git_config'),
     fs = require('fs'),
     git = require('nodegit'),
     path = require('path'),
     github = path.join(pathgit, "azout");


 let clone = (username, password, cloneURL, localPath) => {
     cloneOptions = {
         remoteCallbacks: {
             credentials: () => {
                 return git.Cred.userpassPlaintextNew(username, password);
             }
         }
     };
     git.Clone(cloneURL, localPath, cloneOptions)
         .catch((err) => {
             console.log(err.toString());
         })
         .then((repository) => {
             // Access any repository methods here.
             console.log("Everything is all right");
             //  console.log("Is the repository bare? %s", Boolean(repository.isBare()));
         })
         .done();
 };

 clone('yoyo', 'baba', "http://localhost:8080/api/git_serve/nodeTest/admin/johnsnow/nodeTest.git", github);

 module.exports = clone;