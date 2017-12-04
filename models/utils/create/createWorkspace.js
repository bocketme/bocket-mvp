let Workspace = require("../../Workspace");

function createWorkspace(name, organization, owner) {
    if (!name || !organization || !owner)
        throw "createWorkspace need 3 parameters";
    return new Workspace({
        name : name,
        owner: {_id: owner._id, completeName: owner.completeName, email: owner.email},
        organization: {_id: organization._id, name: organization.name, }
    });
}

module.exports = createWorkspace;