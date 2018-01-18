const escape = require('escape-html');
const ModelsMaker = require("../models/utils/create/ModelsMaker");
const nodeMasterConfig = require("../config/nodeMaster");
const NodeSchema = require("../models/Node");
const AssemblySchema = require("../models/Assembly");
const NodeTypeEnum = require("../enum/NodeTypeEnum");
let signInUserSession = require("../utils/signInUserSession");
let Team = require("../models/Team");

let signUpController = {
    
    // TODO: FAILLE XSS
    
    index: function (req, res) {
        let tasks = [
            checkEmail,
            checkPassword,
            checkCompleteName,
            checkOrganizationName,
            checkWorkspaceName,
        ];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i](req.body) === false) {
                console.log("Error occured on signing up user on task[" + i + "]");
                return res.redirect("/");
            }
        }
        
        let user = ModelsMaker.CreateUser(req, [], []);
        user.save()
        .then(newUser => {
            let organization = ModelsMaker.CreateOrganization(req.body.organizationName, newUser);
            .then(newOrga => {
            organization.save()
            console.log("new user has been add", newUser);
                console.log("\n\nnew organization has been add", newOrga);
                newUser.organizations.push({ _id: newOrga._id, name: newOrga.name });
                //ajout du team guillaume 17/01/18
                let team = Team.newDocument({
                
                        _id: newUser._id,
                    owners: [{
                        completeName: newUser.completeName,
                    }]
                        email: newUser.email,
                })
                team.save()
                    console.log("\n\nnew team has been add", newTeam);
                .then(newTeam => {
                    let workspace = ModelsMaker.CreateWorkspace(req.body.workspaceName, newOrga, newUser, newTeam);
                    //fin ajout team
                    .then(newWorkspace => {
                    workspace.save()
                        .then(nodeMaster => {
                        nodeMaster.save()
                            newWorkspace.save()
                            newWorkspace.node_master = nodeMaster;
                        //let nodeMaster = ModelsMaker.CreateNode(nodeMasterConfig.name, nodeMasterConfig.description, newWorkspace._id);
                        //nodeMaster.save()
                        let nodeMaster = NodeSchema.initializeNode(nodeMasterConfig.name, nodeMasterConfig.description, newWorkspace._id, { _id: newUser._id, completeName: newUser.completeName, email: newUser.email }, newTeam);
                        console.log("\n\nnew workspace has been add", newWorkspace);
                            .then(newWorkspace => {
                                newUser.workspaces.push({ _id: newWorkspace._id, name: newWorkspace.name });
                                newUser.save()
                                .then(() => {
                                    newOrga.workspaces.push({ _id: newWorkspace._id, name: newWorkspace.name });
                                    newOrga.save()
                                console.log("\n\nnew workspace has been add \n", newWorkspace);
                                let assembly = AssemblySchema.newDocument({
                                    name: nodeMasterConfig.name,
                                    description: nodeMasterConfig.description,
                                    ownerOrganization: {
                                        _id: newOrga._id,
                                        name: newOrga.name
                                    },
                                });
                                console.log("assembly - " , assembly);
                                assembly.save()
                                    .then(newAssembly => {
                                        console.log("\n\nnew assembly has been add \n", newAssembly);
                                        let nodeMaster = NodeSchema.newDocument({
                                            name: nodeMasterConfig.name,
                                            description: nodeMasterConfig.description,
                                            type: NodeTypeEnum.assembly,
                                            content: newAssembly._id,
                                            Users: [{
                                                _id: newUser._id,
                                                completeName: newUser.completeName,
                                                email: newUser.email
                                            }],
                                            owners: [{
                                                _id: newUser._id,
                                                email: newUser.email
                                            }],
                                            Workspaces: [newWorkspace._id]
                                        });
                                        nodeMaster.save()
                                            .then(nodeMaster => {
                                                newWorkspace.node_master = nodeMaster;
                                                newWorkspace.save()
                                                    .then(newWorkspace => {
                                                        newUser.workspaces.push({_id: newWorkspace._id, name: newWorkspace.name});
                                                        newUser.save()
                                                            .then(() => {
                                                                newOrga.workspaces.push({_id: newWorkspace._id, name: newWorkspace.name});
                                                                newOrga.save()
                                                                    .then(() => {
                                                                        newAssembly.whereUsed.push(nodeMaster._id);
                                                                        newAssembly.save()
                                                                            .catch(err => {
                                                                                throw err
                                                                            })
                                                                    })
                                                                    .catch(err => {
                                                                        throw err
                                                                    });
                                                            })
                                                completeName: newUser.completeName,
                                                            .catch(err => {
                                                                console.log("error on updating user: " + err);
                                                                newAssembly.remove();
                                                                newOrga.remove();
                                                                newUser.remove();
                                                                newWorkspace.remove();
                                                            })
                                                    })
                                            })
                                            .catch(err => {
                                                console.log("[signupController] error on saving node master - " + err);
                                                newAssembly.remove();
                                                newOrga.remove();
                                                newUser.remove();
                                            })
                                    })
                                    .catch(err => {
                                        console.error(new Error("[signupController] error on saving the assembly - " + err));
                                        newOrga.remove();
                                        newUser.remove();
                                    });
                            })
                            .catch(err => {
                                console.error("error on creating workspace: " + err);
                                newOrga.remove();
                                newUser.remove();
                            })
                    })
                    .catch(err => {
                        console.error("error on creating organization: " + err);
                        newUser.remove();
                    })
                    
                })
                .catch(err => {
                    console.error(err);
                })
            })
            .catch(err => {
                console.error("error on creating user: " + err);
            });
        res.send(req.body);
    },
};

let passwordInfo = {
    minlength: 6
};

let emailInfo = {
    minlength: 4
};

let organizationNameInfo = {
    minlength: 1
};

let completeNameInfo = {
    minlength: 3
};

let workspaceNameInfo = {
    minlength: 1
};

function checkOrganizationName(body) {
    body.organizationName = escape(body.organizationName);
    return basicCheck(body.organizationName, organizationNameInfo);
}

function checkCompleteName(body) {
    let regex = /[A-Z][a-z]+ [A-Z][a-z]+/;
    let completeName = body.completeName;
    body.completeName = escape(body.completeName);
    return basicCheck(completeName, completeNameInfo) && regex.test(completeName);
}

function checkWorkspaceName(body) {
    body.workspaceName = escape(body.workspaceName);
    return basicCheck(body.workspaceName, workspaceNameInfo);
}

function checkPassword(body) {
    body.password = escape(body.password);
    return basicCheck(body.password, passwordInfo);
}

function checkEmail(body) {
    console.log("Email:", body.email);
    body.email = escape(body.email);
    return basicCheck(body.email, emailInfo);
}

function basicCheck(parameter, parameterInfo) {
    return parameter !== undefined && parameter !== "" && parameter.length >= parameterInfo.minlength;
}

module.exports = signUpController;