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
    let nbr = (!context.nbr) ? (5) : (context.nbr);

    Node.findById(nodeId)
        .then(node => {
            if (node === null) return console.log("[getActivities]: node not found");
            //console.log("getActivityCommentsLister: ", node.activities, nbr);
            if (context.viewType === ViewTypeEnum.location)
                getActivityCommentsEmitter(socket, node.activities, context.viewType, nbr);
            else if (node.type === NodeTypeEnum.assembly) {
                console.log("Assembly id: ", node.content);
                Assembly.findById(node.content)
                    .then(assembly => {
                        let activities = (assembly !== null) ? (assembly.activities) : ([]);
                        getActivityCommentsEmitter(socket, activities, context.viewType, nbr)
                    })
                    .catch(err => console.log("[getActivities] Assembly : ", err));
            } else {
                Part.findById(node.content)
                    .then(part => {
                        let activities = (part !== null) ? (part.activities) : ([]);
                        getActivityCommentsEmitter(socket, activities, context.viewType, nbr)
                    })
                    .catch(err => console.log("[getActivityComments] Part : ", err));
            }
        })
        .catch(err => console.log("[getActivities]: ", err, "\nNodeId: ", nodeId, "\nnbr: ", nbr))
  })
};