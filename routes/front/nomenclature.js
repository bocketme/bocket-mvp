const express = require("express"),
    app = express(),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated'),
    connection = require('../../database/index'),
    Promise = require('promise'),
    sqlPromise = require('../api/utils/promiseSQL'),
    http = require('http'),
    server = http.Server(app),
    io = require('socket.io').listen(server);

/**
 * View with 3D viewer
 */
router.get("/nomenclature/:id", isAuthentificated, (req, res, next) => {
    //api/projects/:idproject

    let idProject = req.params.id,
        projectName = null;

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
            return getRequest('http://localhost:8080/api/menu_build/' + idProject);
        })
        .then((body5) => {
            menu = JSON.parse(body5);
            return;
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.render("nomenclature-3d", {
                assets_name: "nomenclature-3d",
                page_name: "3D Viewer",
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
});

/**
 * Get the nomenclature with a specific branch
 */
router.get("/nomenclature/:idProject/:idBranch", isAuthentificated, (req, res, next) => {
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
            res.render("nomenclature-3d", {
                assets_name: "nomenclature-3d",
                page_name: "3D Viewer",
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
});


/**
 * Get the nomenclature with a specific node
 */
router.get("/nomenclature/:idProject/:idBranch/:idNode", isAuthentificated, (req, res, next) => {
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

    let comments = [];
    let data3d = {};

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
            return getRequest('http://localhost:8080/api/node/files3d/' + idNode);
        })
        .then((body6) => {
            data3d = body6;
            return sqlPromise.getNodeComments(req.params.idNode);
        })
        // .then(result => {
        //     comments = result;
        //     return new Promise((res, rej) => {
        //         for (let i = 0; i < comments.length; i++) {
        //             sqlPromise.getUser(comments[i].id_author)
        //                 .then(author => {
        //                     comments[i].username = author.username;
        //                     if (i == comments.length - 1)
        //                         res(comments);
        //                 })
        //                 .catch((err) => {
        //                     rej(err);
        //                 });
        //         }
        //     });
        // })
        /*.then(result => {

        })*/
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            io.sockets.emit('data3d', {
                data3d: data3d
            });

            res.render("nomenclature-3d", {
                assets_name: "nomenclature-3d",
                page_name: "3D Viewer",
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
                menu: menu,
                comments: comments,
                data3D: data3d
            });

        });
});

module.exports = router;