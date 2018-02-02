const User = require("../models/User"),
    Node = require("../models/Node"),
    Part = require("../models/Part"),
    Assembly = require("../models/Assembly"),
    escape = require("escape-html"),
    fs = require("fs"),
    path = require("path"),
    configServer = require("../config/server"),
    NodeTypeEnum = require("../enum/NodeTypeEnum"),
    PartFileSystem = require('../config/PartFileSystem'),
    twig = require("twig");

module.exports = function (socket) {
    socket.on("nodeInformation", (nodeID) => {
        Node.findById(nodeID, (err, node) => {
            if (err || !node)
                socket.emit("NodeError");
            else {
                let userId = [];
                node.owners.forEach(user => {
                    userId.push({
                        url: "/user/photo/" + user._id,
                        name: user.completeName
                    })
                });

                socket.emit("nodeLocation", {
                    maturity: node.maturity,
                    owners: userId,
                    createdOn: node.created,
                    modified: node.modified
                });

                if (node.type == NodeTypeEnum.assembly) {
                    Assembly.findById(node.content)
                        .then((assembly) => {

                            console.log("Nodeinformation \n",assembly);
                            fs.readdir(path.join(configServer.files3D, assembly.path, PartFileSystem.spec), (err, files) => {
                                let filesInfo = [];

                                if (files){
                                    files.forEach(file => {
                                        let ext = path.extname(file);
                                        filesInfo.push({
                                            name: file,
                                            extension: ext
                                        });
                                    });
                                }

                                twig.renderFile("./views/socket/specFilesList.twig", { filesInfo: filesInfo.length == 0 ? null : filesInfo },
                                    (err, html) => {
                                        if (err)
                                            Promise.reject(err);
                                        socket.emit("fileSpec - Success", html);
                                    });

                            });
                        })

                        .catch((err) => {
                            console.error(err);
                            socket.emit("filesSpec - Error", "We cannot find the spec of your node");
                        });
                } else if (node.type == NodeTypeEnum.part) {
                    Part.findById(node.content)
                        .then((part) => {
                            fs.readdir(path.join(configServer.files3D, part.path, PartFileSystem.spec), (err, files) => {
                                let filesInfo = [];

                                if (files){
                                    files.forEach(file => {
                                        let ext = path.extname(file);
                                        filesInfo.push({
                                            name: file,
                                            extension: ext
                                        });
                                    });
                                } else filesInfo = null;

                                twig.renderFile("./views/socket/specFilesList.twig", { filesInfo: filesInfo },
                                    (err, html) => {
                                        if (err)
                                            Promise.reject(err);
                                        socket.emit("fileSpec - Success", html);
                                    });
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                            socket.emit("filesSpec - Error", "We cannot find the spec of your node");
                        });
                } else 
                    socket.emit("[Node Information] - error", "The node is neither a part nor an assembly.");

                //All the other information
                socket.emit("nodeInformation", node)
            }
        });
    });
};
