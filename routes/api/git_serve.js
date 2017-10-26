const express = require("express"),
    zlib = require('zlib'),
    path = require('path'),
    connection = require('../../database/index'),
    pathgit = require('../../bucketgit/git_config'),
    backend = require('git-http-backend'),
    router = express.Router(),
    spawn = require('child_process').spawn;

router.use('/api/git_serve/:repo/:username/:password', (req, res, next) => {
        let repo = req.params.repo,
            username = req.params.username,
            password = req.params.password;

        connection.query("SELECT rights_file.write_right FROM rights_file, node, project, affectation, branch, user WHERE (user.username = ?) AND (user.password = ?) AND (user.id = affectation.id_user) AND (rights_file.id_affectation = affectation.id) AND (rights_file.id_node = node.id) AND (node.id_branch = branch.id) AND (project.id = branch.id_project) AND (project.path = ?) ", [username, password, repo], (err, results, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else if (!results || results.length == 0)
                res.status(404).send("Not Found");
            else {
                results.forEach(function(element) {
                    if (element.write_right == true)
                        next();
                });
            }
        });
    },
    (req, res) => {
        let repo = req.params.repo,
            chemin = path.join(pathgit, repo);
        let reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req;

        reqStream.pipe(backend(req.url, function(err, service) {
            if (err) return res.status(500).send(err).end();

            res.setHeader('content-type', service.type);

            var ps = spawn(service.cmd, service.args.concat(chemin));
            ps.stdout.pipe(service.createStream()).pipe(ps.stdin);

        })).pipe(res);

        // req.pipe(server_git).pipe(res);
    });

module.exports = router;