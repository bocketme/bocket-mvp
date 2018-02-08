const User = require("../models/User"),
    Node = require("../models/Node"),
    Part = require("../models/Part"),
    Assembly = require("../models/Assembly"),
    escape = require("escape-html"),
    fs = require("fs"),
    path = require("path"),
    configServer = require("../config/server"),
    NodeTypeEnum = require("../enum/NodeTypeEnum"),
    PartFileSystem = require('../config/PartFileSystem');;

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

                socket.emit("nodeLocation", {
                    maturity: node.maturity,
                    owners: userId,
                    createdOn: node.created,
                    modified: node.modified
                });

                if (node.type == NodeTypeEnum.assembly){
                    Assembly.findById(node.content)
                    .then((assembly) => {
                        fs.readdir(path.join(configServer.files3D, assembly.path, PartFileSystem.spec), (err, files)=> {
                            socket.emit("fileSpec", files);
                        });
                    })
                    .catch(() => {
                            socket.emit("[Node Information]", "The ");
                    })
                } else if (node.type == NodeTypeEnum.part) {
                    Assembly.findById(node.content)
                    .then(() => {
                        fs.readdir(path.join(configServer.files3D, assembly.path, PartFileSystem.spec), (err, files)=> {
                            socket.emit("fileSpec", files);
                        });
                    })
                    .catch(() => {

                    })

                } else {
                    socket.emit("[Node Information] - error", "The node is neither a part nor an assembly.")
                }

                //All the other information
                socket.emit("nodeInformation", node)
            }
        });
    });

};
