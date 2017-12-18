const getActivityCommentsEmitter = require("./emitter/getActivityCommentsEmitter");
const addActivity = require("./utils/addActivity");
const ActivityTypeEnum = require("../enum/ActivitiyTypeEnum");

module.exports = (socket) => {
    /**
     * Add a new comment in the activities of node
     * @Param context : { nodeId: string, comment : { author : string, content : string, date: Date }, viewTYpe }
     */
    socket.on("newActivityComment", (context) => {
        //TODO: ajouter type dans comment & filepath
        //TODO: check if the user has rights
        addActivity(ActivityTypeEnum.comment, context, context.viewType)
            .then(activities => {
                //console.log("then", activities);
                getActivityCommentsEmitter(socket, activities, context.viewType)
            })
            .catch(err => console.log("[newCommentListener] :", err));
    })
};
