let Node = require("../models/Node");

module.exports = (socket) => {
    /**
     * @Param context : { nodeId: string, comment : { author : string, content : string, date: Date } }
     */
    socket.on("newActivityComment", (context) => {
        let nodeId = context.nodeId;
        let comment = context.comment;
        //TODO: check if the user has rights
        Node.findById(nodeId)
            .then(node => {
                if (node === null) {
                    console.log("Node pas trouvé", nodeId, "\n", comment);
                    return ;
                }
                console.log("Node = ", node);
            })
            .catch(err => console.log("[newCommentListener] :", err, "\nNodeid:", nodeId, "\n", comment));
    })
};
