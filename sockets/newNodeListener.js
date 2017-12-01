let ModelsMaker = require("../models/utils/create/ModelsMaker");
let Workspace = require("../models/Workspace");
let Node = require("../models/Node");
let internalErrorEmitter = require("./emitter/internalErrorEmitter");

/**
 * Add a new node to the parentNode, and then send the information to the front
 * @param socket
 */
function newNodeListener(socket) {
    socket.on("newNode", (context) => { // context = {workspaceId, node {name, descruption}, parent (parentId) }
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
                                    socket.emit("newNode", n) // emit the parent node and et child node to the front
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
    console.log("node: ", node._id, " parent: ", parentId);
    return new Promise((resolve, reject) => {
        Node.findById(parentId)
            .then(parent => {
                if (parent === null)
                    resolve(null);
                parent.children.push({_id: node._id, title: node.name, children: node.children});
                parent.save()
                    .then(n => resolve({parent: n, child: node}))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err));
    })
}
