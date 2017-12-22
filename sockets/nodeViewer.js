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
                        socket.emit('[viewer] -> end chargement', node._id, node.name);
                        let promises = [];
                        node.children.forEach(child => {
                            promises.push(promiseNode(child._id, {
                                name: node.name,
                                _id: node._id
                            }))
                        });
                        Promise.all(promises)
                            .then(() => {
                                resolve()
                            });
                    } else {
                        Part.findById(node.content)
                            .then((part) => {
                                console.log(part);
                                fs.readFile(path.resolve('./test/converter.json'), 'utf8', (err, file) => {
                                    socket.emit("addPart", file, parent._id);
                                    socket.emit('[viewer] -> end chargement', node._id, node.name);
                                    resolve();
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


