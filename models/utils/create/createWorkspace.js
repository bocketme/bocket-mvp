let Workspace = require("../../Workspace");

function createWorkspace(name, organization) {
    return new Workspace({
        name : name,
        organization: {_id: organization._id, name: organization.name, }
    });
}

module.exports = createWorkspace;