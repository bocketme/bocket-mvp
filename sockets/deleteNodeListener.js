const socketName = "deleteNode";
const Node = require("../models/Node");
const User = require("../models/User");

/**
 * Check if the user can delete the node
 * @param userMail {string}
 * @param nodeId {string}
 * @return {Promise<void>}
 */
async function doesHeHaveRights(userMail, nodeId) {
    const user = await User.findOne({email: userMail});
    const node = await Node.findById(nodeId);

    console.log("User's mail:", user.email);
    console.log("Node's name:", node.name);

    const members = node.team.members;
    const owners = node.team.owners;

    if (members.find(member => member.email === userMail) && owners.find(member => member.email === userMail)) {
        return true;
    }
    return false;
}

/**
 * Delete the node & notify all the user
 * @param nodeId
 */
function deleteNode(nodeId) {

}

module.exports = async (socket) => {
    socket.on(socketName, (nodeId) => {
        console.log("[debub] nodeId:", nodeId);
        doesHeHaveRights(socket.handshake.session.userMail, nodeId)
            .then(doesHe => {
                if (doesHe)
                    deleteNode(nodeId);
            })
            .catch(err => console.log("[deleteNodeListener] err : ", err));
    })
};
