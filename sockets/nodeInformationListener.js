let User = require("../models/User");
let Node = require("../models/Node");
let escape = require("escape-html");
let fs = require("fs");
let path = require("path");
let configServer = require("../config/server");
let NodeTypeEnum = require("../enum/NodeTypeEnum");

module.exports = function (socket) {

    socket.on("nodeInformation", (nodeID) => {
        Node.findById(nodeID, (err, node) => {
            if (err || !node)
            socket.emit("NodeError");
            else {
                console.log(node)

                let userId = []
                node.Users.forEach(user => {
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
                // Envoyer le fichier 3D
                if (node.type == NodeTypeEnum.assembly) {
                    socket.emit("nodeObjectError", 'Feature not supported !');
                    // socket.emit("nodeObject", fs.read(path.resolve(configServer.gitfiles , node.assembly.path() )));

                    //Envoyer les annotations
                    if (node.annotation)
                    socket.emit('NodeAnnotation', node.assembly.annotation);
                }
                else if (node.type == NodeTypeEnum.part) {
                    socket.emit("nodeObject", fs.read(path.resolve(configServer.gitfiles , node.part.path() )));

                    //Envoyer les annotations.
                    if (node.part.annotation)
                    socket.emit('NodeAnnotation', node.part.annotation)
                }
                else socket.emit("nodeObjectError", 'No 3D Aviable');
                // Envoyer le nom des fichiers de specs
                if (node.specFiles){
                    let fileName = [];
                    node.specFiles.forEach(file => {
                        fileName.push(file.name);
                    });
                    socket.emit("fileSpec", fileName);
                }
                //All the other information
                socket.emit("nodeInformation", node)
            }
        });
    });

};
