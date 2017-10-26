let git = require('nodegit');
let path = require('path');
let Commit = require('./models/commit'),
    pathgit = require('./git_config');

let url = "git@git.epitech.eu:/mesqui_v/nodeGitTest";
let local_path = "./repo/nodeGitTest";

gitLog = (repoName) => {
    return new Promise((res, rej) => {
        git.Repository.open(path.join(pathgit, repoName)).then(function (repo) { // Ouvre le repo
            let commits_tab = [];
            repo.getHeadCommit() // Récupère le dernier commit
                .then((commit) => {
                    let hist = commit.history();
                    p = new Promise((resolve, reject) => {
                        hist.on('end', (commits) => { // Quand tous les commits sont load on les enrengistre dans un tableau
                            //console.log('All commits have been load.');
                            resolve(commits);
                        });
                        hist.on('error', (err) => {
                            reject('Error on loading logs');
                        });
                    });
                    hist.start();
                    return p;
                })
                .then((commits) => {
                    for (let commit of commits) {
                        c = new Commit(commit.author().name(), commit.date(), commit.message());
                        commits_tab.push(c);
                        //console.log('Nouveau Commit : ', c);
                    }
                    res(commits_tab); // Toutes les informations nécessaire sont enrengistrés
                })
                .catch(err => rej(err));
        }).catch(err => rej(err));
    }); // fin promise
};

module.exports = gitLog;