const Node = require("../models/Node");
const getActivityCommentsEmitter = require("./emitter/getActivityCommentsEmitter");

module.exports = (socket) => {
    /**
     * Get n comment(s) of node activity
     * @Param context : { nodeId: string, nbr: string (nbr of needed comments, 1 by default) }
     */
  socket.on("getActivityComments", (context) => {
    let nodeId = context.nodeId;
    let nbr = (!context.nbr) ? (5) : (context.nbr);

    Node.findById(nodeId)
        .then(node => {
            if (node === null) return console.log("[getActivityComments]: node not found");
            //console.log("getActivityCommentsEmitter: ", node.activities, nbr);
            getActivityCommentsEmitter(socket, node.activities, nbr);
        })
        .catch(err => console.log("[getActivityComments]: ", err, "\nNodeId: ", nodeId, "\nnbr: ", nbr))
  })
};