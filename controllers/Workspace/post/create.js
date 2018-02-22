const escape = require('escape-html');

const Workspace = require("../models/Workspace");
const Organization = require("../models/Organization");
const User = require("../models/User");

let createNewWorkspace = async (req, res) => {
    let organizationId = escape(),
        workspaceName = escape(),
        organizationName = escape();

    console.log(req.body);
    console.log(req.session);

    let user = await User.find();

    let workspace = await Workspace.find();

    let organization = await Organization.craete({

    });


};

create3Workspace = (req, res) => { // req = { organizationId, workspaceName, email, password, organizatioName }
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
                    let nodeMaster = ModelsMaker.CreateNode(nodeMasterConfig.name, nodeMasterConfig.description, w._id);
                    nodeMaster.save()
                        .then(n => {
                            w.node_master = nodeMaster;
                            w.save()
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
                        })
                        .catch(err => {
                            console.log("[wokspace controller] error on saving node Master : ", err);
                            res.sendStatus(500);
                        })
                        .catch(err => {
                            console.log("[wokspace controller] error on saving node Master : ", err);
                            res.sendStatus(500);
                        });
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