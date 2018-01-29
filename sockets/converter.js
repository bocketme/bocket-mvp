const NodeSchema = require ("../models/Node"),
    AssemblySchema = require("../models/Assembly"),
    PartSchema = require("../models/Part"),
    path = require("path"),
    fs = require("fs"),
    configServer = require("../config/server"),
    NodeTypeEnum = require("../enum/NodeTypeEnum"),
    converter = require("../convertisseur/converter"),
    partFileSystem = require("../config/PartFileSystem");

module.exports = (socket) => {
    socket.on("[Converter Import] - Start", (nodeId, nameFile) => {
        NodeSchema.findById(nodeId)
            .then((node) => {
                if (node.type == NodeTypeEnum.assembly)
                    return AssemblySchema.findById(node.content);
                else if (node.type == NodeTypeEnum.part)
                    return PartSchema.findById(node.content);
                else
                    Promise.reject("The node type is neither an assembly nor a part");
            })
            .then((content) => {
                if (!content.path)
                    Promise.reject("The node has no files");
                let chemin = path.join(configServer.files3D, content.path, partFileSystem.rawFile, nameFile);
                fs.open(chemin, 'r+', '0o666', (err, fd) => {
                    if (err){
                        if (err.code = "ENOENT")
                            Promise.reject("The file does not exist");
                        else
                            Promise.reject(err)
                    }
                    console.log(fd);
                    try {
                        console.log(chemin);
                        let pathConvertedFile = converter.JSimport(chemin);
                        /*
                            fs.rename(pathConvertedFile, path.join(configServer.files3D, content.path, partFileSystem.data, nameFile), (err) => {
                                if(err)
                                    Promise.reject(err);
                            });
                        */
                    } catch (e) {
                        console.log(e);
                    }
                });
                console.log("convsersion Finished");
                socket.emit("[Converter] - Success", content.name);
                //socket.broadcast("[Converter] - Success", content.name);
            })
            .catch((error) => {
                console.error(error);
                socket.emit("[Converter] - Error", error);
            });
    });
};