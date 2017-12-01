let ModelsMaker = require("../models/utils/create/ModelsMaker");
let Workspace = require("../models/Workspace");
let Node = require("../models/Node");
let internalErrorEmitter = require("./emitter/internalErrorEmitter");

function newNodeListener(socket) {
    socket.on("newNode", (context) => { // context = {workspaceId, nodeInformation }
        Workspace.findById(context.workspaceId)
            .then(workspace => {
                if (workspace === null)
                {
                    console.log("workspace not found");
                    return ;
                }
                //TODO: check if use has the rights
                let node = ModelsMaker.CreateNode(context.node.name, context.node.description, context.workspaceId);
                node.save()
                    .then(node => {
                        AddNode(node, context.parent)
                            .then(n => {
                                if (n !== null)
                                    socket.emit("newNode", n)
                            })
                            .catch((err) => {
                                console.log("[newNodeListener] : ", err);
                                internalErrorEmitter(socket)
                            });
                    })
            })
            .catch((err) => {
                console.log("[newNodeListener2] : ", err);
                internalErrorEmitter(socket);
            });
        console.log("userMail:", socket.handshake.session.userMail);
        console.log("workspaceId:", context.workspaceId);
        console.log("node:", context.node);
    })
}

module.exports = newNodeListener;

function AddNode(node, parentId) {
    return new Promise((resolve, reject) => {
        Node.findById(parent)
            .then(parent => {
                if (parent === null)
                    resolve(null);
                parent.children.push({_id: node._id, title: node.name, children: node.children});
                parent.save()
                    .then(n => resolve(n))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));
    })
}
