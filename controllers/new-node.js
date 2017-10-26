const connection = require('../database/index'),
    express = require("express"),
    router = express.Router(),
    getRequest = require('../routes/front/utils/getRequest'),
    request = require('request');

var newnode = {
    get: (req, res) => {
        let idProject = req.params.idProject;
        let projectName = null;
        let firstnames = [];
        let lastnames = [];
        let emails = [];

        let nodeIds = [];
        let nodeNames = [];
        let id3DFiles = [];
        let statesOfMaturity = [];
        let nodeBranches = [];

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

                    if (key === "id_branch")
                        nodeBranches.push(value);
                });
                return;
            })
            .catch((err) => {
                console.log(err);
            })
            .done(() => {
                res.render("new-node", {
                    assets_name: "new-node",
                    page_name: projectName + " - New node",
                    project_name: projectName,
                    project_id: idProject,
                    firstnames: firstnames,
                    lastnames: lastnames,
                    emails: emails,
                    nodeIds: nodeIds,
                    nodeNames: nodeNames,
                    nodeBranches: nodeBranches
                });

            });

    }
};

module.exports = newnode;