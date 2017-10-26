const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

/**
 * Router to get a single issue
 */
router.get("/issues/:idProject/:idIssue", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.idProject;
    let idIssue = req.params.idIssue;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let title = null;
    let content = null;
    let isResolved = [];

    let commentsContents = [];
    let commentsDateOfPublish = [];
    let commentsAuthors = [];

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

            return getRequest("http://localhost:8080/api/issue/" + idIssue);
        })
        .then((body3) => {
            JSON.parse(body3, (key, value) => {
                if (key === "title") {
                    title = value;
                }
                if (key === "content") {
                    content = value;
                }
                if (key === "is_resolved") {
                    let resolvedToString = null;
                    if (value === 0) {
                        resolvedToString = "No";
                    } else {
                        resolvedToString = "Yes";
                    }
                    isResolved = resolvedToString;
                }
            });

            return getRequest('http://localhost:8080/api/comments/issue/' + idIssue);
        })
        .then((body4) => {

            JSON.parse(body4, (key, value) => {
                if (key === "content")
                    commentsContents.push(value);

                if (key === "date_of_publish")
                    commentsDateOfPublish.push(value);

                if (key === "id_author")
                    commentsAuthors.push(value);
            });

            return;
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.render("single-issue", {
                assets_name: "single-issue",
                page_name: "Issues",
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                title: title,
                content: content,
                isResolved: isResolved,
                commentsContents: commentsContents,
                commentsDateOfPublish: commentsDateOfPublish,
                commentsAuthors: commentsAuthors
            });
        });
});

module.exports = router;