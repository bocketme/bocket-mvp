let Organization = require("../../Organization");

function createOrganization(name, owner) {
    return new Organization({
        owner: {completeName: owner.completeName, email: owner.email},
        name: name,
    })
}

module.exports = createOrganization;