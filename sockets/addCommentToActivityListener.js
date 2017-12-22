const addCommentToActivity = "addCommentToActivity";
const NewActivityCommentEmitter = require("./emitter/newActiityCommentEmitter");
const User = require("../models/User");
const Node = require("../models/Node");
const Assembly = require("../models/Assembly");
const Part = require("../models/Part");
const TypeViewEnum = require("../enum/ViewTypeEnum");
const TypeNodeEnum = require("../enum/NodeTypeEnum");
const TypeActivityEnum = require('../enum/ActivitiyTypeEnum');
const formatDate = require("./utils/formatDate");

module.exports = (socket) => {
    /**
     * Add a new comment to an activity
     * @Param data: {nodeId : string, activityIndex : String, comment: {content: String, date: Date}, viewType : ViewTypeEnum}
     * @Param data.activityIndex : give the index of comments array
     */
    socket.on(addCommentToActivity, (data) => {
        //TODO: check if the user has rights
        if (!data.nodeId || !data.activityIndex || !data.comment || !data.comment.content || !data.comment.date || !data.viewType)
            return console.log(`[${addCommentToActivity}0]: parameters error :\n`, data);
        let email = socket.handshake.session.userMail;
        User.findOne({email: email})
            .then(user => {
                if (!user) return console.log(`User not found : ${email}`);
                Node.findById(data.nodeId)
                    .then(node => {
                        console.log("ici");
                        if (data.viewType === TypeViewEnum.location)
                            addComment(node, data.activityIndex, data.comment, user.completeName)
                                .then((m) => NewActivityCommentEmitter(socket, data.nodeId, m))
                                .catch(err => console.log(`[${addCommentToActivity}1]: ${err}`));
                        else if (data.viewType === TypeViewEnum.content) {
                            let modelFindeur = (node.type === TypeNodeEnum.assembly) ? (Assembly) : (Part);
                            modelFindeur.findById(node.content)
                                .then(model => {
                                    addComment(node, data.activityIndex, data.comment, user.completeName)
                                        .then((m) => NewActivityCommentEmitter(socket, data.nodeId, m))
                                        .catch(err => console.log(`[${addCommentToActivity}2]: ${err}`));
                                })
                                .catch(err => console.log(`[${addCommentToActivity}3]: ${err}`));
                        }
                    })
                    .catch(err => console.log(`[${addCommentToActivity}4]: ${err}`));
            })
            .catch(err => console.log(`[${addCommentToActivity}5]: ${err}`))
    });
};

/**
 * addComment to an location activity
 * @param model : Mongoose model which the function will add the comment
 * @param comment : comment: {content: String, date: Date}
 */
function addComment(model, activityIndex, comment, completeName) {
    return new Promise((res, rej) => {
        let index = activityIndex;
        console.log("index = ", index, model.activities.length);
        console.log('comment = ', comment);
        if (!index || index < 0 || index >= model.activities.length)
            rej("Wrong index = ", index);
        comment.type = TypeActivityEnum.comment;
        comment.author = completeName;
        comment.author = completeName;
        comment.files = [];
        comment.comments = [];
        console.log("COMMENT ===", comment);
        model.activities[index].comments.push(comment);
        console.log("save: ", model.activities[index]);
        model.save()
            .then(m => {
                let o = JSON.parse(JSON.stringify(m.activities[index].comments[m.activities[index].comments.length - 1]));
                o.index = index;
                console.log("o = ", o);
                o.date = formatDate(o.date, new Date);
                res(o);
            })
            .catch(err => rej(err));
    });
}
