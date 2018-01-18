const escape = require('escape-html');
const ModelsMaker = require("../models/utils/create/ModelsMaker");
const nodeMasterConfig = require("../config/nodeMaster");
const NodeSchema = require("../models/Node");
const AssemblySchema = require("../models/Assembly");
const NodeTypeEnum = require("../enum/NodeTypeEnum");
const OrganizationSchema = require("../models/Organization");
const UserSchema = require("../models/User");
const WorkspaceSchema = require("../models/Workspace");
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
        
        let Documents = {}
        
        Documents.user = UserSchema.newDocument({
            completeName: req.body.completeName,
            password : req.body.password,
            email : req.body.email,
            workspaces: [],
            organizations: []
        });
        Documents.user.save()
        .then((newUser) => {
            Documents.user = newUser
            console.log(Documents.user);
            Documents.organization = OrganizationSchema.newDocument({
                owner: {
                    _id: Documents.user._id, 
                    completeName: Documents.user.completeName, 
                    email: Documents.user.email
                },
                members: [{
                    _id: Documents.user._id, 
                    completeName: Documents.user.completeName, 
                    email: Documents.user.email
                }],
                name: req.body.organizationName
            })
            return Documents.organization.save();
        })
        .then(newOrga => {
            Documents.organization = newOrga;
            console.log("new Organization is created", newOrga);
            let team = Team.newDocument({
                owners: [{
                    completeName: Documents.user.completeName,
                }],
                email: Documents.user.email,
            })
            return team.save();
        })
        .then(newTeam => {
            Documents.team = newTeam
            console.log("\n\nnew team has been add", newTeam);
            Documents.workspace = WorkspaceSchema({
                name : name,
                owner: {
                    _id:            Documents.user._id, 
                    completeName:   Documents.user.completeName, 
                    email:          Documents.user.email
                },
                organization: {
                    _id:    Documents.organization._id, 
                    name:   Documents.organization.name, 
                },
                team: {
                    _id:        Documents.team._id, 
                    owners:     Documents.team.owners, 
                    members:    Documents.team.members, 
                    consults:   Documents.team.consults
                }
            });
            return Documents.workspace.save()
        })
        .then(newWorkspace => {
            Documents.workspace = newWorkspace;
            console.log("\n\nnew workspace has been add \n", Documents.workspace);
            Documents.user.push({ _id: Documents.workspace._id, name: Documents.workspace.name });
            return Documents.user.save();
        })
        .then(() => {
            Documents.assembly = AssemblySchema.newDocument({
                name: nodeMasterConfig.name,
                description: nodeMasterConfig.description,
                ownerOrganization: {
                    _id:    Documents.organization._id,
                    name:   Documents.organization.name
                },
            });
            return Documents.assembly.save();
        })
        .then(newAssembly => {
            Documents.assembly = newAssembly;
            console.log("\n\nnew assembly has been add \n", Documents.assembly);
            Documents.node = NodeSchema.newDocument({
                name:           nodeMasterConfig.name,
                description:    nodeMasterConfig.description,
                type:           NodeTypeEnum.assembly,
                content:        Documents.assembly._id,
                Users: [{
                    _id:            Documents.user._id,
                    completeName:   Documents.user.completeName,
                    email:          Documents.user.email
                }],
                owners: [{
                    _id:    Documents.user._id,
                    email:  Documents.user.email
                }],
                Workspaces: [Documents.workspace._id]
            });
            return Documents.node.save();
        })
        .then(nodeMaster => {
            Documents.node = nodeMaster;
            console.log("\n\nnew node has been add \n", Documents.node);
            Documents.workspace.node_master = nodeMaster;
            return Documents.workspace.save()
        })
        .then(() => {
            Documents.user.workspaces.push({
                _id: Documents.workspace._id, 
                name: Documents.workspace.name});
            return Documents.user.save();
        })
        .then(() => {
            Documents.organization.workspaces.push({
                _id: Documents.workspace._id, 
                name: Documents.workspace.name});
            return Documents.organization.save();
        })
        .then(() => {
            Documents.assembly.whereUsed.push(nodeMaster._id);
            return Documents.assembly.save();
        })
        .catch(err => {
            console.error("[Sign up Controller] -  erreur \n" + err);
            Object.values(Documents).forEach(Documents => {
                if (Documents)
                    Documents.remove();
            });
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