let escape = require('escape-html');

let Workspace = require("../models/Workspace");
let Organization = require("../models/Organization");
let User = require("../models/User");

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

        User.findOne({email: email})
            .then(user => {
                let newWorkspace = ModelsMaker.CreateWorkspace(workspaceName, organization, user);
                newWorkspace.save()
                    .then(w => {
                        Organization.findOne({_id: organizationId, name: organizationName})
                            .then(organization => {
                                if (organization === null)
                                {
                                    console.log("[wokspace controller] error on finding organization (null): ", err);
                                    res.sendStatus(500);
                                    return ;
                                }
                                organization.workspaces.push({_id: w._id, name: w.name});
                                user.workspaces.push({_id: w._id, name: w.name});
                                organization.save()
                                    .then(() => user.save())
                                    .catch(err => {
                                        console.log("[workspace controller] error on adding workspace to organization & user : ", err);
                                        w.remove();
                                        organization.workspaces.pop();
                                        user.workspaces.pop();
                                        res.sendStatus(500);
                                    });
                            })
                            .catch(err => {
                                console.log("[wokspace controller] error on finding organization : ", err);
                                res.sendStatus(500);
                            });
                        res.send(w);
                    })
                    .catch(err => {
                        console.log("[wokspace controller] error on saving new workspace : ", err);
                        res.sendStatus(500);
                    })
            })
            .catch(err => {
                console.log("[wokspace controller] error on saving new workspace : ", err);
                res.sendStatus(404);
            });
    }
};

module.exports = controller;