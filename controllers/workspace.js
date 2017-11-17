let escape = require('escape-html');
let Workspace = require("../models/Workspace");

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
        let organizationId = escape(req.organizationName);
        let workspaceName = escape(req.workspaceName);
        let email = escape(req.email);
        let password = escape(req.password);
        let organizationName = escape(req.organizationName);



        res.send(req.body);
    }
};

module.exports = controller;