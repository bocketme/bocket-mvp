const Node = require('../models/Node');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const TypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');

module.exports = socket => {
    socket.on("start viewer", (workspaceId) => {
        fs.readFile(path.resolve('./test/converter.json'), 'utf8', (err, file) => {
            socket.emit("addPart", file, "objects");
        })
    });
};

function promiseNode(nodeId, parentMatrice) {
    Node.findById(nodeId)
        .then(node => {
            if(TypeEnum.assembly == node.type) {
                node.children.forEach(child => {
                    if(TypeEnum.assembly == child.type) {

                    } else if (TypeEnum.part == node.type) {

                    }
                    else {
                        return (new Error("The type's node is nor an "
                            + TypeEnum.part + " or an "
                            + TypeEnum.assembly + " but an " + node.type));
                    }

                })
            }
            else if (TypeEnum.part == node.type) {

            }
            else {
                return (new Error("The type's node is nor an "
                    + TypeEnum.part + " or an "
                    + TypeEnum.assembly + " but an " + node.type));
            }
        })
}

function promiseNode(nodeID){
    return new Promise((resolve, reject) => {
        Node.findById(nodeID)
            .then((node) => {
                if(TypeEnum.assembly == node.type)
                    return promiseAssembly(node);
                else if (TypeEnum.part == node.type)
                    return promisePart(node.content);
                else {
                    reject(new Error("The type's node is nor an "
                        + TypeEnum.part + " or an "
                        + TypeEnum.assembly + " but an " + node.type));
                }
            })
            .then(() => {

            })
            .catch(err => {
                console.error(new Error("Couldn't contact the database - ", err));
                reject();
            });
    });
}

function promisePart(content){
    return new Promise((resolve, reject)=> {
        Part.findById(content)
            .then(() => {})
            .catch(err => {
                console.error(new Error("Couldn't contact the database - ", err));
                reject();
            });
    });
}

function promiseChildren(node){
    return new Promise((resolve, reject)=> {

    });
}
