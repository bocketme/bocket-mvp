const Node = require("../models/Node");
const getActivityCommentsEmitter = require("./emitter/getActivitiesEmitter");
const ViewTypeEnum = require("../enum/ViewTypeEnum");
const NodeTypeEnum = require("../enum/NodeTypeEnum");
const Assembly = require("../models/Assembly");
const Part = require("../models/Part");


module.exports = (socket) => {
    /**
     * Get n comment(s) of node activity
     * @Param context : { nodeId: string, nbr: string (nbr of needed comments, 1 by default) }
     */
  socket.on("getActivities", (context) => {
    let nodeId = context.nodeId;

    Node.findById(nodeId)
        .then(node => {
            if (node === null) return console.log("[getActivities]: node not found");
            //console.log("getActivityCommentsLister: ", node.activities, nbr);
            getActivityCommentsEmitter(socket, node.activities, ViewTypeEnum.content, node.activities.length);
        })
        .catch(err => console.log("[getActivities]: ", err, "\nNodeId: ", nodeId, "\nnbr: ", nbr))
  })
};