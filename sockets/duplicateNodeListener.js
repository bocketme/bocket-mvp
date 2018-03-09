let duplicateNode = "duplicateNode";
let Node = require("../models/Node");
let Workspace = require("../models/Workspace");
let mongoose = require('mongoose');

/**
 *
 * @param userEmail
 * @param data : {{nodeId: String}}
 * @returns Promise
 */
function duplicateNodeListener(userEmail, data) {
    return new Promise((res, rej) => {

        const query = Node.findById(data.nodeId)
            .or([{
                'team.members.email': userEmail,
                'team.owners.email': userEmail
            }])
            .then(node => {
                if (!node) res(null);
                node._id = undefined;
                node.name += " - copy";
                node.isNew = true;
                //node.path = null;
                console.log("NODE ", node);
                node.save()
                    .then(node => {
                        const parentNode = Node.findOne({ "children._id" : data.nodeId})
                        .then((parent) => {
                            parent.children.push({
                                _id: node._id,
                                type: node.type,
                                name: node.name, 
                            });
                            parent.save()
                            .then(() => {
                                Workspace.findById(node.Workspace)
                                .then(w => {
                                    w.node
                                })
                                .catch(err => rej(err));
                                res(node);    
                            })
                        })
                    })
                    .catch(err => rej(err));
            })
            .catch(err => rej(err));
    });
}

module.exports = (socket) => {
    socket.on(duplicateNode, (data) => {
        duplicateNodeListener(socket.handshake.session.userMail, data)
            .then(res => console.log("duplicateNodeListener : ", res))
            .catch(err => console.log("duplicateNodeListener error : ", err));
    })
};