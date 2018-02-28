const User = require("../models/User");
const Node = require("../models/Node");
const Part = require("../models/Part");
const Assembly = require("../models/Assembly");
const escape = require("escape-html");
const fs = require("fs");
const path = require("path");
const configServer = require("../config/server");
const NodeTypeEnum = require("../enum/NodeTypeEnum");
const PartFileSystem = require('../config/PartFileSystem');
const log = require('../utils/log');

module.exports = function (socket) {
    let asyncNodeInformation = async (nodeId) => {
        let node;
        let content;
        let userId = [];
        try {
            node = await Node.findById(nodeId);
            node.owners.forEach(user => {
                userId.push({
                    url: "user/photo/" + user._id,
                    name: user.completeName,
                });
            });

            if (node.type === NodeTypeEnum.part)
                content = await Part.findById(node.content);
            else if (node.type === NodeTypeEnum.assembly)
                content = await Assembly.findById(node.content);
            else throw Error("Node type Error");

            if (!content)
                throw Error("No content Found");
        } catch (err) {
            throw Error(err);
        }
        socket.emit("[Node] - Details", {
            name: content.name,
            description: content.description,
            created: node.created,
            organization: content.ownerOrganization.name,
            creator: content.creator.completeName,
        });
        fs.readdir((path.join(configServer.files3D, content.path, PartFileSystem.spec)), {encoding: 'utf8'}, (err, files) => {
            if (err) 
                throw err;
            files.forEach(file => socket.emit('addSpec', file));
        });
    }

    socket.on('nodeInformation', nodeId => {
        log.info('salut')
        asyncNodeInformation(nodeId)
        .catch((err) => {
            log.error(err)
        })
    })
    /*
    socket.on("nodeInformation", (nodeID) => {
        Node.findById(nodeID, (err, node) => {
            if (err || !node)
                socket.emit("NodeError");
            else {
                //console.log(node);
                let userId = []
                node.owners.forEach(user => {
                    userId.push({
                        url: "/user/photo/" + user._id,
                        name: user.completeName
                    })
                });
                var contentId = node.content;
                var contentType = node.type;

                log.info("Content Information : ", node.type);

                if (node.type === NodeTypeEnum.assembly) {
                    content = Assembly.findById(node.content)
                        .then((content) => {
                            var contentName = content.name;
                            var contentDescription = content.description;
                            var contentCreated = node.created;
                            var contentOrganization = content.ownerOrganization.name;
                            var contentCreator = content.creator.completeName;

                            log.info("socket emit | nodeLocation")
                            socket.emit("nodeLocation", {
                                name: content.name,
                                description: content.description,
                                created: contentCreated,
                                organization: contentOrganization,
                                creator: contentCreator,
                            });

                            fs.readdir(path.join(configServer.files3D, assembly.path, PartFileSystem.spec), (err, files) => {
                                socket.emit("fileSpec", files);
                            });
                        })
                        .catch(() => {
                            socket.emit("[Node Information]", "The Node has no file");
                        })
                } else if (node.type === NodeTypeEnum.part) {
                    content = Part.findById(node.content)
                        .then((content) => {

                            var contentName = content.name;
                            var contentDescription = content.description;
                            var contentCreated = node.created;
                            var contentOrganization = content.ownerOrganization.name;
                            var contentCreator = content.creator.completeName;

                            log.info("socket emit | nodeLocation")
                            socket.emit("nodeLocation", {
                                name: content.name,
                                description: content.description,
                                created: contentCreated,
                                organization: contentOrganization,
                                creator: contentCreator,
                            });

                            fs.readdir(path.join(configServer.files3D, part.path, PartFileSystem.spec), (err, files) => {
                                socket.emit("fileSpec", files);
                            });
                        })
                        .catch(() => {
                            socket.emit("[Node Information]", "The Node has no file");
                        })

                } else {
                    socket.emit("[Node Information] - error", "The node is neither a part nor an assembly.")
                }


                //All the other information
                socket.emit("nodeInformation", node)
            };
        });
    });
    */
};
