const newActivityEmitter = require("./emitter/newActivityEmitter");
const addActivity = require("./utils/addActivity");
const ActivityTypeEnum = require("../enum/ActivitiyTypeEnum");
const User = require("../models/User");

module.exports = (socket, io) => {
    /**
     * Add a new comment in the activities of node
     * @Param context : { nodeId: string, comment : { author : string, content : string, date: Date }, viewTYpe }
     */
    socket.on("newActivityComment", (context) => {
        //TODO: ajouter type dans comment & filepath
        //TODO: check if the user has rights
        console.log("context", context);

        User.findOne({email: socket.handshake.session.userMail})
            .then(user => {
                if (user === null) return console.log("User not found!");
                context.comment.author = user.completeName;
                context.comment.avatar = user.avatar;
                addActivity(ActivityTypeEnum.comment, context, context.viewType)
                    .then(activity => {
                        console.log("then", activity);
                        newActivityEmitter(io, socket, activity, context.viewType, socket.handshake.session.currentWorkspace);
                    })
                    .catch(err => console.log("[newCommentListener] :", err));
            })
            .catch(err => console.log("[newCommentListener] :", err));
    })
};
