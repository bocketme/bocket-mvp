let Node = require('../../Node');
let NodeTypeEnum = require("../../../enum/NodeTypeEnum");

function CreateNode(name, description, workspaceId, type, team) {
    if (!name || !description || !workspaceId || !team)
        throw new Error("CreateNode failed with : name :", name, " description:", description, " workspaceId :", workspaceId, "team" ,team);

    if (!type)
        type = NodeTypeEnum.assembly;
    return new Node({
        name: name,
        description: description,
        Workspace: workspaceId,
        type: type,
        team: {_id: team._id, owners: team.owners, members: team.members, consults:team.consults}
    });
}

module.exports = CreateNode;