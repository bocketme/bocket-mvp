const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

/**
 * View the project pull-request
 */
router.get("/issues/:idProject", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.idProject;
    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let issuesIds = [];
    let titles = [];
    let contents = [];
    let isResolved = [];

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
            return getRequest("http://localhost:8080/api/project/issues/" + idProject);
        })
        .then((body3) => {
            JSON.parse(body3, (key, value) => {
                if (key === "id") {
                    issuesIds.push(value);
                }
                if (key === "title") {
                    titles.push(value);
                }
                if (key === "content") {
                    contents.push(value);
                }
                if (key === "is_resolved") {
                    let resolvedToString = null;
                    if (value === 0) {
                        resolvedToString = "No";
                    } else {
                        resolvedToString = "Yes";
                    }
                    isResolved.push(resolvedToString);
                }
            });
            return;
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.render("issues", {
                assets_name: "issues",
                page_name: "Issues",
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                issuesIds: issuesIds,
                titles: titles,
                contents: contents,
                isResolved: isResolved
            });
        });
});

module.exports = router;