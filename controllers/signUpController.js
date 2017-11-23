let escape = require('escape-html');
let ModelsMaker = require("../models/utils/create/ModelsMaker");

let signUpController = {

    // TODO: FAILLE XSS

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

        let user = ModelsMaker.CreateUser(req, [], []);
        user.save()
            .then(newUser => {
                console.log("new user has been add", newUser);
                let organization = ModelsMaker.CreateOrganization(req.body.organizationName, user);
                organization.save()
                    .then(newOrga => {
                        console.log("\n\nnew organization has been add", newOrga);
                        user.organizations.push({_id: newOrga._id, name: newOrga.name});
                        let workspace = ModelsMaker.CreateWorkspace(req.body.workspaceName, newOrga);
                        workspace.save()
                            .then(newWorkspace => {
                                console.log("\n\nnew workspace has been add", newWorkspace);
                                user.workspaces.push({_id: newWorkspace._id, name: newWorkspace.name});
                                user.save()
                                    .catch(err => {
                                        console.log("error on updating user: " + err);
                                        newOrga.remove();
                                        newUser.remove();
                                        newWorkspace.remove();
                                    })
                            })
                            .catch(err => {
                                console.log("error on creating workspace: " + err);
                                newOrga.remove();
                                newUser.remove();
                            })
                    })
                    .catch(err => {
                        console.log("error on creating organization: " + err);
                        newUser.remove();
                    });
            })
            .catch(err => {
            console.log("error on creating user: " + err);
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

function basicCheck(parameter, parameterInfo)
{
    return parameter !== undefined && parameter !== "" && parameter.length >= parameterInfo.minlength;
}

module.exports = signUpController;