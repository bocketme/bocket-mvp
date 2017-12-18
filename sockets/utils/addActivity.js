const Node = require("../../models/Node");
const Assembly = require("../../models/Assembly");
const Part = require("../../models/Part");
const NodeTypeEnum = require("../../enum/NodeTypeEnum");
const ViewTypeEnum = require("../../enum/ViewTypeEnum");

/**
 * Add an activity
 * @param type : String Type of activity (look ActivityTypeEnum.js)
 * @param context :  {{ nodeId: string, comment : { author : string, content : string, date: Date }}}
 * @param context.nodeId : String
 * @param context.comment : String Comment Informations
 * @param context.comment.author : String
 * @param context.comment.content : String
 * @param context.comment.date : String published date
 * @param viewType
 */
function addActivity(type, context, viewType) {
    console.log("viewtype =", viewType);
    if (viewType === ViewTypeEnum.content)
        return contentView(type, context);
    else
        return locationView(type, context);
}

module.exports = addActivity;

/**
 * Add activity in Node
 * @param type : String Type of activity (look ActivityTypeEnum.js)
 * @param context :  {{ nodeId: string, comment : { author : string, content : string, date: Date }}}
 */
function locationView (type, context){
    return new Promise((res, rej) => {
        let nodeId = context.nodeId;
        let comment = context.comment;
        let today = new Date();

        Node.findById(nodeId)
            .then(node => {
                if (node === null) return console.log("Node pas trouvé", nodeId, "\n", comment);
                if (isValid(today, comment)) {
                    console.log("AJOUT DANS NODE");
                    comment.type = type;
                    node.activities.push(comment);
                    node.save()
                        .then(() => res(comment))
                        .catch(err => rej(err));
                }
                //console.log("Node:", node);
            })
            .catch(err => rej(err));
    });
}

function contentView(type, context) {
    return new Promise((res, rej) => {
        let nodeId = context.nodeId;
        let comment = context.comment;
        let today = new Date();

        Node.findById(nodeId)
            .then(node => {
                if (node === null) return console.log("Node pas trouvé", nodeId, "\n", comment);
                if (node.type === NodeTypeEnum.empty) return console.log("Empty node");
                if (isValid(today, comment)) {
                    comment.type = type;
                    if (node.type === NodeTypeEnum.assembly) {
                        console.log("AJOUT DANS ASSEMBLY", node.content);
                        Assembly.findById(node.content)
                            .then(assembly => {
                                if (assembly === null) return console.log("assembly not found", node);
                                assembly.activities.push(comment);
                                assembly.save()
                                    .then(() => res(comment))
                                    .catch(err => rej(err))
                            })
                            .catch(err => rej(err));
                    } else {
                        console.log("AJOUT DANS PART");
                        Part.findById(node.content)
                            .then(part => {
                                if (part === null) return console.log("part not found");
                                part.activities.push(comment);
                                part.save()
                                    .then(() => res(comment))
                                    .catch(err => rej(err))
                            })
                            .catch(err => rej(err));
                    }
                }
            })
            .catch(err => rej(err));
    });
}

/**
 * Check if the comment is valid
 * @param comment : { author : string, content : string, date: Date }
 */
function isValid(today, comment) {
    let commentDate = new Date(comment.date);
    return comment.author !== "" && comment.comment !== "" && comment.date !== null;
}