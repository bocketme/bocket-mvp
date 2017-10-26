const connection = require('../database/index'),
    express = require("express"),
    router = express.Router(),
    getRequest = require('../routes/front/utils/getRequest'),
    request = require('request');


let branch = {
    get: (req, res) => {
        let idProject = req.params.idProject;

        let projectName = null;
        let firstnames = [];
        let lastnames = [];
        let emails = [];

        let branchesNames = [];
        let branchesIds = [];
        let branchesFirstNode = [];

        let nodeIds = [];
        let nodeNames = [];
        let id3DFiles = [];
        let statesOfMaturity = [];

        getRequest('http://localhost:8080/api/projects/' + idProject)
            .then((body1) => {
                //Getting all the projects id and name for the current user connected
                JSON.parse(body1, (key, value) => {
                    if (key === "name") {
                        projectName = value;
                    }
                });
                return getRequest('http://localhost:8080/api/nodes/' + idProject);
            })
            .then((body2) => {
                JSON.parse(body2, (key, value) => {
                    if (key === "id")
                        nodeIds.push(value);

                    if (key === "name")
                        nodeNames.push(value);

                    if (key === "id_files3D")
                        id3DFiles.push(value);

                    if (key === "state_of_maturity")
                        statesOfMaturity.push(value);
                });
                return getRequest('http://localhost:8080/api/branch/all/' + idProject);
            })
            .then((body3) => {
                JSON.parse(body3, (key, value) => {
                    if (key === "id")
                        branchesIds.push(value);

                    if (key === "name")
                        branchesNames.push(value);

                    if (key === "id_first_node")
                        branchesFirstNode.push(value);
                });
                return;
            })
            .catch((err) => {
                console.log(err);
            })
            .done(() => {
                res.render("new-branch", {
                    assets_name: "new-branch",
                    page_name: projectName + " - New branch",
                    project_name: projectName,
                    project_id: idProject,
                    firstnames: firstnames,
                    lastnames: lastnames,
                    emails: emails,
                    branchesIds: branchesIds,
                    branchesNames: branchesNames,
                    branchesFirstNode: branchesFirstNode,
                    nodeIds: nodeIds,
                    nodeNames: nodeNames
                });

            });
    },
    post: (req, res, next) => {
        request.post("http://localhost:8080/api/branch/" + req.body.parent_node + "/" + req.body.branch_name);
        res.redirect(req.originalUrl);
    }
};

module.exports = branch;