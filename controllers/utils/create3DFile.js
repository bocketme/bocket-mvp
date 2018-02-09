const fs = require('fs'),
    path = require('path'),
    file_accepted = require('../../utils/extension_file'),
    converter = require("../../converter/converter"),
    partFileSystem = require("../../config/PartFileSystem"),
    util = require('util');

const optionStream = {
    flags: 'w',
    encoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true
}

async function create3DFile(chemin, file) {
    let filePath = path.join(chemin, partFileSystem.data, file.originalname);
    let file3D = fs.createWriteStream(filePath, optionStream);

    file3D.end(file.buffer);

    file3D.on("close", (listener) => {
        let pathConvertedFile = converter.JSimport(filePath);
        console.log("path here : " + filePath);
    });
}

module.exports = create3DFile;
