const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

router.get('/pullrequest/:idproject/:idpullrequest', isAuthentificated, (req, res) => {

    let idPullRequest = req.params.idpullrequest,
        idProject = req.params.idproject;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let title = null;
    let description = null;
    let sourceBranch = {};
    let destinationBranch = {};

    let destinationNode = {};

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
            return getRequest("http://localhost:8080/api/project/get_pull_request/" + idPullRequest);
        })
        .then((body3) => {
            JSON.parse(body3, (key, value) => {
                if (key === "title")
                    title = value;

                if (key === "content")
                    description = value;

                if (key === "branch_source")
                    sourceBranch.id = value;

                if (key === "branch_destination")
                    destinationBranch.id = value;

            });
            return getRequest("http://localhost:8080/api/branch/" + sourceBranch.id);
        })
        .then((body4) => {
            JSON.parse(body4, (key, value) => {
                if (key === "name")
                    sourceBranch.name = value;

                if (key === "id_first_node")
                    sourceBranch.idFirstNode = value;

                if (key === "id_base_node")
                    sourceBranch.idBaseNode = value;
            });
            return getRequest("http://localhost:8080/api/branch/" + destinationBranch.id);
        })
        .then((body5) => {
            JSON.parse(body5, (key, value) => {
                if (key === "name")
                    destinationBranch.name = value;

                if (key === "id_first_node")
                    destinationBranch.idFirstNode = value;

                if (key === "id_base_node")
                    destinationBranch.idBaseNode = value;
            });
            return getRequest('http://localhost:8080/api/nodeinfo/' + destinationBranch.idBaseNode);
        })
        .then((body6) => {
            JSON.parse(body6, (key, value) => {
                if (key === "id")
                    destinationNode.id = value;

                if (key === "name")
                    destinationNode.name = value;
            });
            return getRequest('http://localhost:8080/api/comments/pullrequest/' + idPullRequest);
        })
        .then((body7) => {
            JSON.parse(body7, (key, value) => {
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
            res.render("single-pullrequest", {
                assets_name: "single-pullrequest",
                page_name: "Pullrequests - " + title,
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                title: title,
                description: description,
                sourceBranch: sourceBranch,
                destinationBranch: destinationBranch,
                destinationNode: destinationNode,
                commentsContents: commentsContents,
                commentsDateOfPublish: commentsDateOfPublish,
                commentsAuthors: commentsAuthors
            });

        });
});

module.exports = router;