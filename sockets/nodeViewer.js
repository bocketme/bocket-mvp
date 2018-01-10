const Node = require('../models/Node');
const Part = require('../models/Part');
const Workspace = require('../models/Workspace');
const TypeEnum = require('../enum/NodeTypeEnum');
const Assembly = require('../models/Assembly');
const fs = require('fs');
const path = require('path');
const config = require('../config/server');

module.exports = socket => {
    socket.on("start viewer", (workspaceId) =>{
        Workspace.findById(workspaceId)
            .then((workspace) => {
                return promiseNode(workspace.node_master._id, workspace._id);
            })
            .catch(err => {console.log(err)});
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
                                        resolve()
                                    });
                    } else {
                        Part.findById(node.content)
                            .then((part) => {
                                let chemin = path.resolve('./test/converter.json');
                                fs.readFile(chemin, 'utf8', (err, file) => {
                                    if(err){
                                        socket.emit('[viewer] -> error chargement', node._id, node.name, err);
                                        resolve();
                                    } else {
                                        socket.emit("addPart", file, node._id, node.matrix, parent._id);
                                        socket.emit('[viewer] -> end chargement', node._id, node.name);
                                        resolve();
                                    }
                                })
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject();
                });
        })
    }

};


