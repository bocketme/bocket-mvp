const NodeSchema = require('../models/Node'),
    AssemblySchema = require('../models/Assembly'),
    PartSchema = require('../models/Part');

const NodeTypeEnum = require('../enum/NodeTypeEnum'),
    configServer = require('../config/server'),
    converter = require('../converter/converter'),
    partFileSystem = require('../config/PartFileSystem');

const path = require('path'),
    fs = require('fs'),
    util = require('util');

fs.open = util.promisify(fs.open);

async function conversion(socket, io, nodeId, nameFile) {
    let node
    try {
        node = await NodeSchema.findById(nodeId);

        if (node.type == NodeTypeEnum.part)
            content = await AssemblySchema.findById(node.content);
        else if (node.type == NodeTypeEnum.assembly)
            content = await NodeSchema.findById(node.content);
        else
            throw new Error("The node type is neither an assembly nor a part");

        if (!content.path)
            throw new Error("The node has no fileSystem");

    } catch (err) {
        socket.emit("[Converter] - Error", error);
    }


    let chemin = path.join(configServer.files3D, content.path, partFileSystem.rawFile, nameFile);

    try {
        await fs.open(chemin, 'r+', '0o666');
    } catch (err) {
        console.error(new Error(err))
        return socket.emit("[Converter] - Error", error);
    }

    try {
        let pathConvertedFile = converter.JSimport(chemin);
    } catch (err) {
        return socket.emit("[Converter] - Error", error);
    }
    // let changement = await fs.rename(pathConvertedFile, path.join(configServer.files3D, content.path, partFileSystem.data, nameFile));
    socket.emit("Converter] - Success", content.name);
}


module.exports = (io, socket) => {
    socket.on("[Converter Import] - Start", (nodeId, nameFile) => {
        conversion(nodeId, nameFile)
        .catch(err => {
            console.error("Unandeled Error \n" + err);
        })
    });
};

