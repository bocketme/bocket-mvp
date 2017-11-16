let User = require("../models/User");
let Organization = require("../models/Organization");
let Workspace = require("../models/Workspace");

let signUpController = {

    index : function(req, res) {
        let tasks = [
            checkEmail,
            checkPassword,
            checkCompleteName,
            checkOrganizationName,
            checkWorkspaceName,
        ];
        for (let i = 0 ; i < tasks.length ; i++) {
            if (tasks[i](req.body) === false) {
                console.log("Error occured on signing up user on task[" + i + "]");
                return res.redirect("/");
            }
        }

        // TODO: Check if user already exist
        // TODO: Check if  organization already exist

        let newUser = createUser(req, [], []);
        newUser.save()
            .then(result => {
                console.log("new user has been add", result);
                let organization = createOrganization(req.body.organizationName, newUser);
                organization.save()
                    .then(newOrga => {
                        console.log("\n\nnew organization has been add", newOrga);
                        newUser.organizations.push({_id: newOrga._id, name: newOrga.name});
                        let workspace = createWorkspace(req.body.workspaceName, newOrga)
                        workspace.save()
                            .then(newWorkspace => {
                                console.log("\n\nnew workspace has been add", newWorkspace);
                                newUser.workspaces.push({_id: newWorkspace._id, name: newWorkspace.name});
                                newUser.save()
                                    .catch(err => {
                                        //TODO: Delete Orga & user & workspace
                                        console.log("error on updating user: " + err);
                                    })
                            })
                            .catch(err => {
                                //TODO: Delete Orga & user
                                console.log("error on creating workspace: " + err);
                            })
                    })
                    .catch(err => {
                        // TODO: Delete User
                        console.log("error on creating organization: " + err);
                    });
            })
            .catch(err => {
            console.log("error on creating user: " + err);
        });
        console.log("Body = ", req.body);
        res.send(req.body);
    },
};

function createWorkspace(name, organization) {
    return new Workspace({
       name : name,
        organization: {_id: organization._id, name: organization.name, }
    });
}

function createOrganization(name, owner) {
    return new Organization({
        owner: {completeName: owner.completeName, email: owner.email},
        name: name,
    })
}

function createUser (req, workspaces, organizations) {
    return  new User({
        completeName: req.body.completeName,
        password : req.body.password,
        email : req.body.email,
        workspaces: workspaces,
        organizations: organizations
    });

}

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
    return basicCheck(body.organizationName, organizationNameInfo);
}

function checkCompleteName(body) {
    let regex = /[A-Z][a-z]+ [A-Z][a-z]+/;
    let completeName = body.completeName;
    return basicCheck(completeName, completeNameInfo) && regex.test(completeName);
}

function checkWorkspaceName(body) {
    return basicCheck(body.workspaceName, workspaceNameInfo);
}

function checkPassword(body) {
    return basicCheck(body.password, passwordInfo);
}

function checkEmail(body) {
    console.log("Email:", body.email);
    return basicCheck(body.email, emailInfo);
}

function basicCheck(parameter, parameterInfo)
{
    return parameter !== undefined && parameter !== "" && parameter.length >= parameterInfo.minlength;
}

module.exports = signUpController;