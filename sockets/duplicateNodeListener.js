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
        console.log(data);
        let query = Node.findById(data.nodeId);
        query.elemMatch("Users", {email: userEmail})
            .then(node => {
                if (!node) res(null);
                node._id = undefined;
                node.name += " - copy";
                node.isNew = true;
                console.log("NODE ", node);
                node.save()
                    .then(node => {
                        Workspace.findById(node.Workspace)
                            .then(w => {
                                w.node
                            })
                            .catch(err => rej(err));
                        res(node)
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
