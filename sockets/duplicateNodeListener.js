const duplicateNode = "duplicateNode";
const Node = require("../models/Node");
const FSconfig = require('../config/FileSystemConfig');
const partSchema = require('../models/Part');
const assemblySchema = require('../models/Assembly');
const util = require('util');
const fs = require('fs');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const log = require('../utils/log');
const path = require('path');
const twig = require('twig');
/**
 *
 * @param userEmail
 * @returns Promise
 */
async function duplicateNodeListener(socket, data) {
    let userMail = socket.handshake.session.userMail;
    let node = await Node.findById(data.nodeId).catch(err => {
        throw err
    });

    let parentNode = await Node.findOne({
        "children._id": data.nodeId
    }).catch(err => {
        throw err
    });

    if (!node || !parentNode) throw new Error('Node or parent Node not Found');

    let content;
    if (node.type === NodeTypeEnum.part) content = await partSchema.findById(node.content);
    else if (node.type === NodeTypeEnum.assembly) content = await assemblySchema.findById(node.content);
    else throw new Error('Incorrect Type of node');

    content._id = undefined;
    const originalPath = content.path;
    content.path = null;
    content.name += "- copy";
    content.isNew = true;

    await content.save().catch(err => {
        throw err
    });

    node._id = undefined;
    node.name = content.name;
    node.isNew = true;
    node.content = content._id;

    await node.save().catch(err => {
        throw err
    });
    parentNode.children.push({
        _id: node._id,
        type: node.type,
        name: node.name,
    });

    await parentNode.save().catch(err => {
        throw err
    });

    let tasks = [];
    if (node.type == NodeTypeEnum.part) {
        tasks.push({
            oldPath: path.join(FSconfig.appDirectory.files3D, originalPath, FSconfig.content.data),
            newPath: path.join(FSconfig.appDirectory.files3D, content.path, FSconfig.content.data),
        });
    }

    tasks.push({
        oldPath: path.join(FSconfig.appDirectory.files3D, originalPath, FSconfig.content.nodes),
        newPath: path.join(FSconfig.appDirectory.files3D, content.path, FSconfig.content.nodes),
    });
    tasks.push({
        oldPath: path.join(FSconfig.appDirectory.files3D, originalPath, FSconfig.content.spec),
        newPath: path.join(FSconfig.appDirectory.files3D, content.path, FSconfig.content.spec),
    });
    tasks.push({
        oldPath: path.join(FSconfig.appDirectory.files3D, originalPath, FSconfig.content.tmp),
        newPath: path.join(FSconfig.appDirectory.files3D, content.path, FSconfig.content.tmp),
    });

    for (let task in tasks) {
        let dir = await readDir(tasks[task].oldPath);

        for (let file in dir) {
            await copyFile(
                path.join(tasks[task].oldPath, dir[file]),
                path.join(tasks[task].newPath, dir[file]),
                fs.constants.COPYFILE_EXCL
            ).catch(err => {
                log.error(err)
            });
        }
    }

    let html = await renderFile('./views/socket/three_child.twig', {
        node: parentNode,
        TypeEnum: NodeTypeEnum,
        sub_level: data.sub_level,
        breadcrumb: data.breadcrumb,
        sockets: [{
            message: 'Update File 3D',
            order: "[Viewer] - Update",
            dataToSend: [node._id],
        }]
    }).catch(err => {throw err});
    socket.emit("duplicateNode", {nodeId: parentNode._id, html});
}

module.exports = (socket) => {
    socket.on(duplicateNode, (data) => {
        duplicateNodeListener(socket, data)
            .catch(err => console.log("duplicateNodeListener error : ", err));
    })
};

const readDir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);
const renderFile = util.promisify(twig.renderFile);