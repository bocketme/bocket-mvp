var git = require('../bucketgit/git_main'),
    Promise = require('promise');

var mtl = {
    get: (req, res) => {
        var node = req.params.node,
            project = req.params.project,
            filename = req.params.file;
        // git.read("nodeTest", filename, node, 'files3D',
        //     (err, result) => {
        //         if (err) {
        //             var error = new Error(err)
        //             error.status = 500;
        //             next(err);
        //         } else {
        //             res.send(result);
        //         }
        //     });
        git.read(project, filename, node,
            (err, value) => {
                if (err)
                    res.status(500).send(err).end();
                else {
                    if (value)
                        res.send(value.toString()).end();
                    else res.status(404).send("Not Found").end();
                }
            });
    },
    post: (req, res) => {
        var repo = req.params.project,
            node = req.params.node,
            mtl = req.params.file,
            message = "[ADD] new version mtl";
        /*
        git.commit.browser(mtl, data, node, 'nodeTest', message,
                (err, commitID) => {
                    if (err) {
                        var error = new Error(err);
                        error.status(500);
                        next(error);
                    } else {
                       //Requête SQL pour mettre le commit ID dans la table des commit.
                        res.send(commitID);
                    }
                });
        */
        git.write(repo, node, mtl, (error) => {
            if (error)
                res.end(error);
            else
                res.end("Le fichier obj a bien été envoyé");
        });
    }
};

module.exports = mtl;