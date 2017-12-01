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
                console.log("ICI");
                let node = ModelsMaker.CreateNode(context.node.name, context.node.description, context.workspaceId);
                console.log("ICI");
                node.save()
                    .then(node => {
                        AddNode(workspace, node)
                    })
                    .then(w => socket.emit("newNode", w.node_master))
                    .catch((err) => {
                        console.log("[newNodeListener] : ", err);
                        internalErrorEmitter(socket)
                    });
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

function AddNode(workspace, node) {
    return new Promise((resolve, reject) => {
        console.log("AddNode");
        Node.findById(workspace.node_master._id)
            .then(node => {
                node.children.push({_id: node._id, title: node.name, children: node.children});
                node.save()
                    .then(n => resolve(n))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));
    })
}
