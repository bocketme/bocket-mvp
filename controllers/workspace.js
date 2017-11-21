let escape = require('escape-html');
let Workspace = require("../models/Workspace");
let ModelsMaker = require("../models/utils/create/ModelsMaker");

let controller = {
    get: (req, res) => {},
    post: (req, res) => {}, 
    update: (req, res) => {},
    initialize: (req, res, next) => {
        let newWorkspace = new Workspace({
            name: req.body.completeName + ' Workspace',
            completeName: req.body.completeName,
            node_master: {name: "My Bocket"},
            organization: {
                name: res.locals.organization.name,
                _id: res.locals.organization._id,
            }
        });
    },
    createWorkspace: (req, res) => { // req = { organizationId, workspaceName, email, password, organizatioName }
        let organizationId = escape(req.body.organizationId);
        let workspaceName = escape(req.body.workspaceName);
        let email = escape(req.body.email);
        let password = escape(req.body.password);
        let organizationName = escape(req.body.organizationName);

        let organization = {
            _id: organizationId,
            name: organizationName
        };

        console.log("orga : ", organization);

        let newWorkspace = ModelsMaker.CreateWorkspace(workspaceName, organization);

        newWorkspace.save()
            .then(result => {
                res.send(req.body + "<br><br>" + result);
            })
            .catch(err => {
                console.log("error = ", err);
                res.redirect("/");
            })
    }
};

module.exports = controller;