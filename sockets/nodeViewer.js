const Node = require('../models/Node');
const Part = require('../models/Part');
const Workspace = require('../models/Workspace');
const TypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const PartFileSystem = require('../config/PartFileSystem')
const config = require('../config/server');

module.exports = socket => {
    socket.on("start viewer", (workspaceId) =>{
        Workspace.findById(workspaceId)
        .then((workspace) => {
            return promiseNode(workspace.node_master._id, workspace._id);
        })
        .catch(err => {
            console.error(err)
        });
    });

    socket.on("[OBJECT 3D] - save", (workspaceId, nodeId, matrix) => {
        //Verificate the rights of the user for this workspace
        console.log("sauvegarde du node ", nodeId, matrix);
        Node.findById(nodeId)
        .then(node => {
            node.matrix = matrix;
            node.save()
        })
    });

    function promiseNode (nodeId, parent){
        return new Promise((resolve, reject) => {
            Node.findById(nodeId)
            .then(node => {
                socket.emit('[viewer] -> start chargement', node._id, node.name);
                if(TypeEnum.assembly == node.type){
                    socket.emit("addAssembly", nodeId, node.matrix, parent._id);
                    let promises = [];
                    node.children.forEach(child => {
                        promises.push(promiseNode(child._id, {
                            name: node.name,
                            _id: node._id
                        }))
                    });
                    Promise.all(promises)
                    .then(() => {
                        socket.emit('[viewer] -> end chargement', node._id, node.name);
                        resolve();
                    });
                } else {
                    Part.findById(node.content)
                    .then((part) => {
                        let chemin = path.join(config.files3D, part.path, PartFileSystem.data);
                        promisifyReaddir(chemin)
                        .then(file => {
                            return promisifyReadFile(path.join(chemin, file[0]));
                        })
                        .then((data) => {
                            socket.emit("addPart", data, node._id, node.matrix, parent._id);
                            socket.emit('[viewer] -> end chargement', node._id, node.name);
                            resolve();
                        })
                        .catch((err) => {
                            socket.emit('[viewer] -> error chargement', node._id, node.name, err);
                            resolve();
                        })
                    });
                }
            })
            .catch(err => {
                console.error(err);
                reject();
            });
        })
    }
};

function promisifyReadFile (chemin) {
    return (new Promise ((resolve, reject) => {
        fs.readFile(chemin, 'utf8', (err, data) => {
            if(err)
            reject(err)
            resolve(data);
        })
    }));
}

function promisifyReaddir (chemin) {
    return (new Promise ((resolve, reject) => {
        fs.readdir(chemin, (err, files) => {
            if(err)
            reject(err);
            resolve(files);
        })
    }))
}
