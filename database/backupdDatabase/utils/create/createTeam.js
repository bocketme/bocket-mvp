let Team = require("../../Team");

function createTeam(owner) {
    if (!owner)
        throw "createTeam need an owner";
    return new Team({
        owners: {_id: owner._id, completeName: owner.completeName, email: owner.email},
         });
}

module.exports = createTeam;