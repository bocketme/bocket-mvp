const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

router.get("/home", isAuthentificated, (req, res, next) => {

    let currentUser = null;

    let projects = [];
    let projectIds = [];
    let projectMasterBranches = [];

    getRequest('http://localhost:8080/api/user/projects/' + req.session.user.id)
        .then((body1) => {
            //Getting all the projects id and name for the current user connected
            JSON.parse(body1, (key, value) => {
                if (key === "id") {
                    projectIds.push(value);
                }
                if (key === "name") {
                    projects.push(value);
                }
                if (key === "id_master_branch") {
                    projectMasterBranches.push(value);
                }
            });
            return;
        })
        .done(() => {
            res.render("home", {
                assets_name: "home",
                page_name: "Home",
                projects: projects,
                projectIds: projectIds,
                projectMasterBranches: projectMasterBranches,
                currentUser: req.session.user
            });

        });
});
router.get("/homelist", isAuthentificated, (req, res, next) => {

    let currentUser = null;

    let projects = [];
    let projectIds = [];

    getRequest('http://localhost:8080/api/user/projects/' + req.session.user.id)
        .then((body1) => {
            //Getting all the projects id and name for the current user connected
            JSON.parse(body1, (key, value) => {
                if (key === "id") {
                    projectIds.push(value);
                }
                if (key === "name") {
                    projects.push(value);
                }
            });
            return;
        })
        .done(() => {
            res.render("home-list", {
                assets_name: "home-list",
                page_name: "Home",
                projects: projects,
                projectIds: projectIds,
                currentUser: req.session.user
            });

        });
});

module.exports = router;