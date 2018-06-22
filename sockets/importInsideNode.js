//TODO Destroy this file or reuse it elsewhere
let serverConfig = require('../config/server');
let Node = require("../models/Node");
let typeEnum = require("../enum/NodeTypeEnum.js");
let Part = require("../models/Part");
let fs = require('fs');
let crypto = require('crypto');

module.exports = (socket) => {
    socket.on("createFile", (nodeId, access) => {
        //Verify the user rights

        //Create a file
        fs.open(path.join(nodeId, access), 'a+', (err) => {
            if (err)
                socket.emit("ErrorToast");
        });
    });

    socket.on("writeStream", (nodeId, access, data) => {
        let writeStream = fs.createWriteStream(path.join(serverConfig.files3D, nodeId, access));
        writeStream.write(data, (err) => {
            socket.emit("ErrorToast");
        });
    });

    socket.on("importPart", (nodeId, partObj) => {
        //WARNING : VERIFY THE USER

        Node.findById(nodeId)
            .then((node) => {
                if(!node) {
                    console.log("Socket [importPart] : Couldn't found a node for the nodeID sent.");
                    socket.emit('ErrorToast', "The node " + part.name + "could'nt be send, please try again later")
                } else if (node.type !== typeEnum.assembly){
                    console.log("Socket [importPart] : The node is a assembly, it should be a part.");
                    socket.emit('ErrorToast', "The node " + part.name + "could'nt be send, please try again later")
                } else {
                    let part = Part.create({
                        name: partObj.name,
                        description: partObj.description,
                        inOrganization: node.Workspaces[0],
                    });
                    part.save()
                        .then((newPart) => {
                            node.type = typeEnum.part;
                            node.content =  newPart._id;
                            node.save()
                                .catch(err => {
                                    console.log(err);
                                    part.remove();
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    socket.emit('ValidateToast', "The part " + partObj.name + " was created")
                }
            })
            .catch(err => {
                console.log(err);
                socket.emit('ErrorToast', "The part " + partObj.name + "could'nt be send, please try again later.")
            })
    });
    socket.on("importAssembly", (nodeId, assemblyObj) => {
        //WARNING : VERIFY THE USER

        Node.findById(nodeId)
            .then((node) => {
                if(!node) {
                    console.log("Socket [importPart] : Couldn't found a node for the nodeID sent.");
                    socket.emit('ErrorToast', "The node " + part.name + "could'nt be send, please try again later")
                } else if (node.type !== typeEnum.part){
                    console.log("Socket [importPart] : The node is a assembly, it should be a part.");
                    socket.emit('ErrorToast', "The node " + part.name + "could'nt be send, please try again later")
                } else {
                    let assembly = Part.create({
                        name: assemblyObj.name,
                        description: assemblyObj.description,
                        in
                    });
                    assembly.save()
                        .then((newPart) => {
                            node.type = typeEnum.assembly;
                            node.content =  newPart._id;
                            node.save()
                                .catch(err => {
                                    console.log(err);
                                    assembly.remove();
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    socket.emit('ValidateToast', "The part " + assemblyObj.name + " was created")
                }
            })
            .catch(err => {
                console.log(err);
                socket.emit('ErrorToast', "The part " + assemblyObj.name + "could'nt be send, please try again later.")
            })

    });
    socket.on("createSpecfiles", (nodeId) => {

    });
    socket.on("create3Dfiles", (nodeId) => {

    });
};

