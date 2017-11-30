let Node = require('../../Node');

function CreateNode(name, description, workspaceId) {
    if (!name || !description || !workspaceId)
        throw("CreateNode failed with : name :", name, " description:", description, " workspaceId :", workspaceId);
    return new Node({
        name: name,
        description: description,
        Workspace: workspaceId,
    });
}

module.exports = CreateNode;