const serverConfiguration = require("../config/server");
const mongoose = require("mongoose");
const NestedNode = require("./nestedSchema/NestedNodeSchema");
const uniqueValidator = require('mongoose-unique-validator');
const NestedUser = require("./nestedSchema/NestedUserSchema");
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const NodeTypeEnum = require("../enum/NodeTypeEnum");
const NestedTeam = require('./nestedSchema/NestedTeamSchema');
const PartSchema = require('./Part');
const AssemblySchema = require('./Assembly');
const THREE = require('three');

let NestedWorkspace = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NodeSchema = mongoose.Schema({
    //The core Information of the node
    name: {type:String, require:true},

    //TODO: Verificate the information
    description: String,

    //The content linked with the node
    type: { type:String, require: true},
    content: {type: mongoose.SchemaTypes.ObjectId, require: true},
    matrix: {type:[] ,default: new THREE.Matrix4()},
    Workspaces: { type:[NestedWorkspace], require: true},

    //The system Information of the Node
    created: {type: Date, default:  Date.now()},
    modified: {type: Date, default: Date.now()},
    maturity: {type: String, default: NodeTypeEnum.maturity[0]},
    activities : {type: [NestedComment], default: []},

    //The
    tags: {type: [String], default: []},
    children: {type: [NestedNode], default: []},
    team: {type: NestedTeam, required: true},
    owners: {type: [NestedUser], default: []},
});

NodeSchema.plugin(uniqueValidator);

/**
 *
 * @param nodeInformation - The Object With all the information
 * @param nodeInformation.name - The name of the node (required)
 * @param nodeInformation.type - The type of the node (required)
 * @param nodeInformation.content - The content of the node(required)
 * @param nodeInformation.Workspaces - The Workspace of the node (required)
 * @param nodeInformation.ownerOrganization - The owner's organization of the node (required)
 * @param nodeInformation.description - The description of the node
 * @param nodeInformation.specFiles - The specFiles of the node
 * @param nodeInformation.tags - The tags of the node
 * @param nodeInformation.children - The children of the node
 * @param nodeInformation.Users - The Users of the node
 * @param nodeInformation.owners - The owners of the node
 */
NodeSchema.statics.newDocument = (nodeInformation) => {
    if (!nodeInformation.name)
        console.error(new Error("The Name of the Node is missing"));

    if (!nodeInformation.type)
        console.error(new Error("The Type of the Node is missing"));

    if (!nodeInformation.content)
        console.error(new Error("The Content of the Node is missing"));

    return new Node(nodeInformation);
};

NodeSchema.pre("remove", function (next) {
    let promises = [];
    this.children.forEach(function (child) {
        promises.push(NodeSchema.findByIdAndRemove(child._id))
    });
    if (this.type === NodeTypeEnum.part)
        promises.push(PartSchema.findByIdAndRemove(this.content));
    else if (this.type ===  NodeTypeEnum.assembly)
        promises.push(AssemblySchema.findByIdAndRemove(this.content));
    Promise.all(promises)
        .then(() => next())
        .catch(err => next(err));
});

const deleteChildren = async () => {

};

let Node = mongoose.model("Node", NodeSchema, "Nodes");

module.exports = Node;