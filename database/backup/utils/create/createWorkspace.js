let Workspace = require("../../Workspace");

function createWorkspace(name, organization, owner, team) {
    if (!name || !organization || !owner || !team)
        throw "createWorkspace need 4 parameters";
    return new Workspace({
        name : name,
        owner: {_id: owner._id, completeName: owner.completeName, email: owner.email},
        organization: {_id: organization._id, name: organization.name, },
        team: {_id: team._id, owners: team.owners, members: team.members, consults:team.consults}
    });
}

module.exports = createWorkspace;