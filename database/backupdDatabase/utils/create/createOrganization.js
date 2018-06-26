let Organization = require("../../Organization");

function createOrganization(name, owner) {
    return new Organization({
        owner: {_id: owner._id, completeName: owner.completeName, email: owner.email},
        members: [{_id: owner._id, completeName: owner.completeName, email: owner.email}],
        name: name,
    })
}

module.exports = createOrganization;