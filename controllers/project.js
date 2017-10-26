const connection = require('../database/index'),
    express = require("express"),
    router = express.Router(),
    getRequest = require('../routes/front/utils/getRequest'),
    request = require('request');

var project = {
    get: (req, res) => {
        res.render("newproject", {
            assets_name: "new-project",
            page_name: "Create a new project"
        });
    },
    post: (req, res, next) => {
        let projectName = req.body.new_title,
            description = req.body.description,
            userId = req.session.user.id,
            teamId = null;

        console.log(req.body);
        getRequest('http://localhost:8080/api/user/getteamid/' + userId)
            .then((body1) => {
                JSON.parse(body1, (key, value) => {
                    if (key === "id_team")
                        teamId = value;
                });
            }).catch((err) => {
                console.log(err);
            })
            .done(() => {
                request.post('http://localhost:8080/api/project/' + teamId + '/' + projectName + '/' + description + ' /');
                res.redirect('/home');
            });
    }
};

module.exports = project;