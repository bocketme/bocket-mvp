const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

router.get("/pullrequests/:id", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.id;
    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let titles = [];
    let contents = [];
    let sourceBranch = [];
    let destinationBranch = [];

    let branches = [];
    let branchesIds = [];
    let plIds = [];

    getRequest('http://localhost:8080/api/projects/' + idProject)
        .then((body1) => {
            //Getting all the projects id and name for the current user connected
            JSON.parse(body1, (key, value) => {
                if (key === "name") {
                    projectName = value;
                }
            });
            return getRequest('http://localhost:8080/api/project/getuser/' + idProject);
        })
        .then((body2) => {
            JSON.parse(body2, (key, value) => {
                if (key === "firstname")
                    firstnames.push(value);

                if (key === "lastname")
                    lastnames.push(value);

                if (key === "email")
                    emails.push(value);
            });
            return getRequest("http://localhost:8080/api/branch/all/" + idProject);
        })
        .then((body3) => {
            JSON.parse(body3, (key, value) => {
                if (key === "id")
                    branchesIds.push(value);

                if (key === "name")
                    branches.push(value);
            });
            return getRequest("http://localhost:8080/api/project/search_pull_request/" + idProject);
        })
        .then((body4) => {
            JSON.parse(body4, (key, value) => {
                if (key === "id")
                    plIds.push(value);

                if (key === "title")
                    titles.push(value);

                if (key === "content")
                    contents.push(value);

                if (key === "branch_source")
                    sourceBranch.push(value);

                if (key === "branch_destination")
                    destinationBranch.push(value);


            });
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.render("pullrequests", {
                assets_name: "pullrequests",
                page_name: "Pull Requests",
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                titles: titles,
                contents: contents,
                sourceBranch: sourceBranch,
                destinationBranch: destinationBranch,
                pullResquestsIds: plIds,
                branches: branches,
                branchesIds: branchesIds
            });
        });
});

module.exports = router;