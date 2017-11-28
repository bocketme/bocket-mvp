let Node = require('../../Node');

function CreateNode(name, description, specpath, Workspace){
    return new Promise((resolve, reject) => {
        if (!name || !description || !specpath || !Workspace)
            reject(new Error("The Node Must have all the parameters"));
        resolve(new Node({
            name : name,
            description : description,
            Workspace: Workspace,
            specpath: specpath,
        }));
    });
}

module.exports = CreateNode