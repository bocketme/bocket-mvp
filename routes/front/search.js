const express = require("express"),
    router = express.Router(),
    request = require('request');


/**
 *
 */
let getRequest = (url, form) => {
    return new Promise((resolve, reject) => {
        request.get("http://localhost:8080" + url, {
            form: form
        }, () => {
            if (response.statusCode == 404)
                success(JSON.stringify({
                    error: "There is no result"
                }));
            else if (!error)
                success(JSON.stringify(body));
            else
                failure(error);
        });
    });
};

/**
 * Make a search through the database. You can search :
 *  - a project
 *  - a node
 *  - a spec file
 *  - a branch
 *  - an issue
 *  - a pull request
 */
router.get("/search", (req, res) => {
    if (!req.session.user) {
        let form = {
                username: req.session.user.username,
                password: req.session.user.password,
                data: req.query.data,
            },
            data = [];
        // Récupérer un noeud
        getRequest("/api/node/search/user", form)
            .then(body => {
                JSON.parse(body, (key, value) => {
                    if (key == name)
                        data.push({
                            node_name: value
                        });
                });
                // Récupérer un projet
                return getRequest("/api/project/search/user", form);
            })
            .then(body => {
                JSON.parse(body, (key, value) => {
                    data.push({
                        project_name: value
                    });
                });
                // Récupérer un fichier de spécification
                return getRequest("/api/spec/search/user", form);
            });
        .then(body => {
                JSON.parse(body, (key, value) => {
                    data.push({
                        specfile_name: value
                    });
                });
                // Récupérer une branche
                return getRequest("/api/branch/search/user", form);
            })
            .then(body => {
                JSON.parse(body, (key, value) => {
                    data.push({
                        specfile_name: value
                    });
                });
                //Récupérer une issue
                return getRequest("/api/issue/search/user", form);
            })
            .then(body => {
                JSON.parse(body, (key, value) => {
                    data.push({
                        specfile_name: value
                    });
                });
                //Récupérer une pull request
                return getRequest("/api/pull_request/search/user", form);
            })
            .then(body => {
                JSON.parse(body, (key, value) => {
                    data.push({
                        specfile_name: value
                    });
                });
                res.send(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("Intern Error");
            })
            .donr();
    } else res.status(401).send("Unauthorized Request");
});

module.exports = router;