let User = require("../models/User");

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
        let newUser = new User({
            completeName: req.body.completeName,
            password : req.body.password,
            email : req.body.email
        });
        newUser.save()
            .then(result => {
                console.log("new user has been add");
            })
            .catch(err => {
            console.log("error : " + err);
        });
        console.log("Body = ", req.body);
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