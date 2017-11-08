let User = require("../models/User");

let signUpController = {

    index : function(req, res) {
        return res.render(signup);
        let tasks = [
            checkUsername,
            checkFirstName,
            checkLastName,
            checkPassword,
            checkCPassword,
            checkEmail,
        ];
        for (let i = 0 ; i < tasks.length ; i++) {
            if (tasks[i](req.body) === false) {
                console.log("Error occured on signing up user");
                return res.redirect("/");
            }
        }
        let newUser = new User({
            username : req.body.username,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
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
        return res.render("signupOrga");
    },

};

let usernameInfo = {
    minlength: 5
};

let firstNameInfo = {
    minlength: 1
};

let lastNameInfo = {
    minlength: 1
};

let passwordInfo = {
    minlength: 6
};

let cpasswordInfo = {
    minlength: 6
};

let emailInfo = {
  minlength: 4
};

function checkUsername(body) {
    return basicCheck(body.username, usernameInfo);
}

function checkFirstName(body) {
    return basicCheck(body.firstName, firstNameInfo);
}

function checkLastName(body) {
    return basicCheck(body.lastName, lastNameInfo);
}

function checkPassword(body) {
    return basicCheck(body.password, passwordInfo);
}

function checkCPassword(body) {
    return basicCheck(body.cpassword, cpasswordInfo);
}

function checkEmail(body) {
    return basicCheck(body.email, emailInfo);
}

function basicCheck(parameter, parameterInfo)
{
    return parameter !== undefined && parameter !== "" && parameter.length >= parameterInfo.minlength;
}

module.exports = signUpController;