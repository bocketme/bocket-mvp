const NodeSchema = require ("../models/Node"),
    AssemblySchema = require("../models/Assembly"),
    PartSchema = require("../models/Part"),
    path = require("path"),
    fs = require("fs"),
    configServer = require("../config/server"),
    NodeTypeEnum = require("../enum/NodeTypeEnum"),
    converter = require("../converter/converter"),
    partFileSystem = require("../config/PartFileSystem"),
util = require('util');

fs.open = util.promisify(fs.open);

async function conversion(nodeId, nameFile) {
    try {
        let node = await NodeSchema.findById(nodeId),
            content;
        if (node.type == NodeTypeEnum.part)
            content = await AssemblySchema.findById(node.content);
        else if (node.type == NodeTypeEnum.assembly)
            content = await NodeSchema.findById(node.content);
        else
            throw new Error("The node type is neither an assembly nor a part");

        if (!content.path)
            throw new Error("The node has no fileSystem");

        let chemin = path.join(configServer.files3D, content.path, partFileSystem.rawFile, nameFile);

        let open = await fs.open(chemin, 'r+', '0o666');

        console.log(open);

        let pathConvertedFile = converter.JSimport(chemin);

        let changement = await fs.rename(pathConvertedFile, path.join(configServer.files3D, content.path, partFileSystem.data, nameFile));

        socket.emit("[Converter] - Success", content.name);
    }   catch(err) {
        console.error(error);
        socket.emit("[Converter] - Error", error);
    }

}


module.exports = (io, socket) => {
    socket.on("[Converter Import] - Start", (nodeId, nameFile) => {
        conversion(nodeId, nameFile)
    });
};
