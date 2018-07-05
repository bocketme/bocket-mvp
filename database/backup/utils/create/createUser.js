let User = require("../../User");

function createUser (req, workspaces, organizations) {
    return  new User({
        completeName: req.body.completeName,
        password : req.body.password,
        email : req.body.email,
        workspaces: workspaces,
        organizations: organizations
    });
}

module.exports = createUser;