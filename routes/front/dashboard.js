const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    request = require('request'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');


router.get("/dashboard/:id", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.id;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let branches = [];
    let branchesIds = [];

    let nodeIds = [];
    let nodeNames = [];
    let id3DFiles = [];
    let statesOfMaturity = [];

    let menu = [];

    /**
     * We get the project name
     */
    getRequest('http://localhost:8080/api/projects/' + idProject)
        .then((body1) => {

            JSON.parse(body1, (key, value) => {
                if (key === "name") {
                    projectName = value;
                }
            });

            /**
             * We get the users on the project
             */
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
            /**
             * Get all the branches on a specific project
             */
            return getRequest('http://localhost:8080/api/branch/all/' + idProject);
        })
        .then((body3) => {
            JSON.parse(body3, (key, value) => {
                if (key === "id")
                    branchesIds.push(value);

                if (key === "name")
                    branches.push(value);

            });
            /**
             * Get all the nodes of the project
             */
            return getRequest('http://localhost:8080/api/nodes/' + idProject);
        })
        .then((body4) => {
            JSON.parse(body4, (key, value) => {
                if (key === "id")
                    nodeIds.push(value);

                if (key === "name")
                    nodeNames.push(value);

                if (key === "id_files3D")
                    id3DFiles.push(value);

                if (key === "state_of_maturity")
                    statesOfMaturity.push(value);

            });
            /**
             * Get the node's tree
             */
            return getRequest('http://localhost:8080/api/menu_build/' + idProject);
        })
        .then((body5) => {
            menu = JSON.parse(body5);
            return;
        })
        .catch((err) => {
            console.error(err);
        })
        .done(() => {
            res.render("dashboard", {
                assets_name: "dashboard",
                page_name: "Dashboard",
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                branches: branches,
                branchesIds: branchesIds,
                nodeIds: nodeIds,
                nodeNames: nodeNames,
                id3DFiles: id3DFiles,
                statesOfMaturity: statesOfMaturity,
                currentUser: req.session.user,
                menu: menu
            });
        });
});


/**
 * Get dashboard with a specific branch
 */
router.get("/dashboard/:idProject/:idBranch", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.idProject;
    let idBranch = req.params.idBranch;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let branches = [];
    let branchesIds = [];

    let nodeIds = [];
    let nodeNames = [];
    let id3DFiles = [];
    let statesOfMaturity = [];

    let menu = [];

    if (!req.session.user) {
        res.redirect('/logout');
    } else {
        getRequest('http://localhost:8080/api/projects/' + idProject)
            .then((body1) => {
                JSON.parse(body1, (key, value) => {
                    if (key === "name") {
                        projectName = value;
                    }
                });
                return getRequest('http://localhost:8080/api/project/getuser/' + idProject);
            });

        getRequest('http://localhost:8080/api/projects/' + idProject)
            .then((body1) => {

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
                return getRequest('http://localhost:8080/api/branch/all/' + idProject);
            })
            .then((body3) => {
                JSON.parse(body3, (key, value) => {
                    if (key === "id")
                        branchesIds.push(value);

                    if (key === "name")
                        branches.push(value);

                });
                return getRequest('http://localhost:8080/api/nodes/' + idProject);
            })
            .then((body4) => {
                JSON.parse(body4, (key, value) => {
                    if (key === "id")
                        nodeIds.push(value);

                    if (key === "name")
                        nodeNames.push(value);

                    if (key === "id_files3D")
                        id3DFiles.push(value);

                    if (key === "state_of_maturity")
                        statesOfMaturity.push(value);

                });
                return getRequest('http://localhost:8080/api/menu_build/branch/' + idBranch);
            })
            .then((body5) => {
                menu = JSON.parse(body5);
                return;
            })
            .catch((err) => {
                console.log(err);
            })
            .done(() => {
                res.render("dashboard", {
                    assets_name: "dashboard",
                    page_name: "Dashboard",
                    project_name: projectName,
                    project_id: idProject,
                    firstnames: firstnames,
                    lastnames: lastnames,
                    emails: emails,
                    branches: branches,
                    branchesIds: branchesIds,
                    nodeIds: nodeIds,
                    nodeNames: nodeNames,
                    id3DFiles: id3DFiles,
                    statesOfMaturity: statesOfMaturity,
                    menu: menu
                });
            });
    }
});

/**
 * Get dashboard with a specific node
 */
router.get("/dashboard/:idProject/:idBranch/:idNode", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.idProject;
    let idBranch = req.params.idBranch;
    let idNode = req.params.idNode;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let branches = [];
    let branchesIds = [];

    let nodeIds = [];
    let nodeNames = [];
    let id3DFiles = [];
    let statesOfMaturity = [];

    let menu = [];

    if (!req.session.user) {
        res.redirect('/logout');
    } else {
        getRequest('http://localhost:8080/api/projects/' + idProject)
            .then((body1) => {
                JSON.parse(body1, (key, value) => {
                    if (key === "name") {
                        projectName = value;
                    }
                });
                return getRequest('http://localhost:8080/api/project/getuser/' + idProject);
            });

        getRequest('http://localhost:8080/api/projects/' + idProject)
            .then((body1) => {

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
                return getRequest('http://localhost:8080/api/branch/all/' + idProject);
            })
            .then((body3) => {
                JSON.parse(body3, (key, value) => {
                    if (key === "id")
                        branchesIds.push(value);

                    if (key === "name")
                        branches.push(value);

                });
                return getRequest('http://localhost:8080/api/nodes/' + idProject);
            })
            .then((body4) => {
                JSON.parse(body4, (key, value) => {
                    if (key === "id")
                        nodeIds.push(value);

                    if (key === "name")
                        nodeNames.push(value);

                    if (key === "id_files3D")
                        id3DFiles.push(value);

                    if (key === "state_of_maturity")
                        statesOfMaturity.push(value);

                });
                return getRequest('http://localhost:8080/api/menu_build/branch/' + idBranch);
            })
            .then((body5) => {
                menu = JSON.parse(body5);
                return;
            })
            .catch((err) => {
                console.log(err);
            })
            .done(() => {
                res.render("dashboard", {
                    assets_name: "dashboard",
                    page_name: "Dashboard",
                    project_name: projectName,
                    project_id: idProject,
                    firstnames: firstnames,
                    lastnames: lastnames,
                    emails: emails,
                    branches: branches,
                    branchesIds: branchesIds,
                    nodeIds: nodeIds,
                    nodeNames: nodeNames,
                    id3DFiles: id3DFiles,
                    statesOfMaturity: statesOfMaturity,
                    menu: menu
                });
            });
    }
});

module.exports = router;