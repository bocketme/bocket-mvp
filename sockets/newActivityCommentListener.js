let Node = require("../models/Node");
let getActivityCommentsEmitter = require("./emitter/getActivityCommentsEmitter");

module.exports = (socket) => {
    /**
     * Add a new comment in the activities of node
     * @Param context : { nodeId: string, comment : { author : string, content : string, date: Date } }
     */
    socket.on("newActivityComment", (context) => {
        //TODO: ajouter type dans comment & filepath
        let nodeId = context.nodeId;
        let comment = context.comment;
        let today = new Date();
        //TODO: check if the user has rights
        Node.findById(nodeId)
            .then(node => {
                if (node === null) return console.log("Node pas trouvé", nodeId, "\n", comment);
                if (isValid(today, comment)) {
                    console.log("IL EST VALIDE");
                    node.activities.push(comment);
                    node.save()
                        .then(() => getActivityCommentsEmitter(socket, [comment]))
                        .catch(err => console.log("[newCommentListener] :", err));
                }
                //console.log("Node:", node);
            })
            .catch(err => console.log("[newCommentListener] :", err, "\nNodeid:", nodeId, "\n", comment));
    })
};

/**
 * Check if the comment is valid
 * @param comment : { author : string, content : string, date: Date }
 */
function isValid(today, comment) {
    let commentDate = new Date(comment.date);
    return comment.author !== "" && comment.comment !== "" && comment.date !== null;
}