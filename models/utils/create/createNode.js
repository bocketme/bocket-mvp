let Node = require('../../Node');
let NodeTypeEnum = require("../../../enum/NodeTypeEnum");

function CreateNode(name, description, workspaceId, type) {
    if (!name || !description || !workspaceId)
        throw new Error("CreateNode failed with : name :", name, " description:", description, " workspaceId :", workspaceId);

    if (!type)
        type = NodeTypeEnum.assembly;
    return new Node({
        name: name,
        description: description,
        Workspace: workspaceId,
        type: type
    });
}

module.exports = CreateNode;