const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    formidable = require('formidable'),
    connection = require('../../database/index'),
    isAuthentificated = require('./utils/isAuthentificated'),
    shell = require('shelljs');

/**
 * Get the global files for the project
 */
router.get('/files/:idproject', isAuthentificated, (req, res) => {

    let idProject = req.params.idproject;

    let projectName = null;

    let firstnames = [];
    let lastnames = [];
    let emails = [];

    let specfiles = [];

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
            return;
        })
        .then(() => {
            fs.chmodSync(path.join(__dirname, '..', '..', '..', idProject, '/specfiles/global/'), '777');
        })
        .then(() => {
            fs.readdirSync(path.join(__dirname, '..', '..', '..', idProject, '/specfiles/global/')).forEach(file => {
                specfiles.push(file);
            });
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.render("files", {
                assets_name: "files",
                page_name: "Files",
                project_name: projectName,
                project_id: idProject,
                firstnames: firstnames,
                lastnames: lastnames,
                emails: emails,
                specfiles: specfiles
            });
        });
});

/**
 * Post route for spec files
 */
router.post("/files/:idProject", isAuthentificated, (req, res) => {
    let idProject = req.params.idProject;

    let firstnames = [];
    let lastnames = [];
    let emails = [];


    let projectName = "",
        pathUploadDir = "",
        form = new formidable.IncomingForm();

    getRequest('http://localhost:8080/api/projects/' + idProject)
        .then((body1) => {
            //Getting all the projects id and name for the current user connected
            JSON.parse(body1, (key, value) => {
                if (key === "name") {
                    projectName = value;
                }
            });
            return;
        })
        .then(() => {
            //We set the path to the destination directory
            //We create the folder id he doesn't exist
            pathUploadDir = path.join(__dirname, '..', '..', '..', idProject, '/specfiles/global/');

            if (!fs.existsSync(pathUploadDir)) {
                shell.mkdir('-p', pathUploadDir);
            }
        })
        .then(() => {
            //We parse the request
            form.parse(req);
            //We overwrite the file path in order to send him into the good folder
            form.on('fileBegin', function (name, file) {
                if (file.name === "") {
                    console.log("[FILE UPLOAD ERROR] -> No file added");
                } else {
                    file.path = pathUploadDir + file.name;
                    connection.query("INSERT INTO specfile (name, id_node) VALUES (? , 1)", [file.name], (err) => {
                        if (err) console.log(err);
                    });
                }
            });
            //We send the file to the folder
            form.on('file', function (name, file) {
                console.log('Uploaded ' + file.name);
            });
        })
        .catch((err) => {
            console.log(err);
        })
        .done(() => {
            res.redirect('/files/' + idProject);
        });
});

module.exports = router;