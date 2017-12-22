const Node = require('../models/Node');
const Part = require('../models/Part');
const Workspace = require('../models/Workspace');
const TypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const config = require('../config/server');
module.exports = socket => {
    socket.on("start viewer", (workspaceId) => {
        Workspace.findById(workspaceId)
            .then((workspace) => {
                return promiseNode(workspace.node_master._id, workspace._id);
            })
            .catch(err => {console.log(err)});
    });

    function promiseNode (nodeId, parent){
        return new Promise((resolve, reject) => {
            Node.findById(nodeId)
                .then(node => {
                    socket.emit('[viewer] -> start chargement', node._id, node.name);
                    if(TypeEnum.assembly == node.type){
                        socket.emit("addAssembly", nodeId, parent);
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
                                let path = path.join(config.gitfiles, part.path);
                                fs.readFile(path, 'utf8', (err, file) => {
                                    console.log('--------------------------------------------------');
                                    console.log('Node - name : ', node.name, ' id :', node._id);
                                    console.log('err => ', err);
                                    console.log('data =>', file);
                                    console.log('--------------------------------------------------');
                                    if(err){
                                        console.log("erreur de chargement : ", node.name);
                                        socket.emit('[viewer] -> error chargement', node._id, node.name, err);
                                        resolve();
                                    } else {
                                        console.log("chargement terminé : ", node.name);
                                        socket.emit("addPart", file, parent._id);
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


