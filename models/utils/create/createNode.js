let Node = require('../../Node');

function CreateNode(name, description, Workspace){
    return new Promise((resolve, reject) => {
        if (!name || !description || !Workspace)
            reject(new Error("The Node Must have all the parameters"));
        resolve(new Node({
            name : name,
            description : description,
            Workspace: Workspace,
        }));
    });
}

module.exports = CreateNode