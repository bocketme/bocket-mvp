const User = require("../models/User"),
    Node = require("../models/Node"),
    Part = require("../models/Part"),
    Assembly = require("../models/Assembly"),
    escape = require("escape-html"),
    fs = require("fs"),
    path = require("path"),
    configServer = require("../config/server"),
    NodeTypeEnum = require("../enum/NodeTypeEnum"),
    PartFileSystem = require('../config/PartFileSystem');
TypeEnum = require('../enum/NodeTypeEnum');


module.exports = function (socket) {
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
                console.log("CONTENT TYPE ET ID", contentType + " et " + contentId);




                if (node.type == NodeTypeEnum.assembly) {
                    content = Assembly.findById(node.content)
                        .then((content) => {

                            var contentName = content.name;
                            var contentDescription = content.description;
                            var contentCreated = node.created;
                            var    contentOrganization= content.ownerOrganization.name;

                            socket.emit("nodeLocation", {
                                name: content.name,
                                description: content.description,
                                created: contentCreated,
                                organization: contentOrganization,
                            });

                            fs.readdir(path.join(configServer.files3D, assembly.path, PartFileSystem.spec), (err, files) => {
                                socket.emit("fileSpec", files);
                            });
                        })
                        .catch(() => {
                            socket.emit("[Node Information]", "The Node has no file");
                        })
                } else if (node.type == NodeTypeEnum.part) {
                    content = Part.findById(node.content)
                        .then((content) => {

                            var contentName = content.name;
                            var contentDescription = content.description;
                            var contentCreated = node.created;
                            var    contentOrganization= content.ownerOrganization.name;
                            console.log("CONTENT PART", content.name);
                            socket.emit("nodeLocation", {
                                name: content.name,
                                description: content.description,
                                created: contentCreated,
                                organization: contentOrganization,
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

};
