const fs = require('fs'),
    path = require('path'),
    file_accepted = require('../../utils/extension_file'),
    converter = require("../../converter/converter"),
    partFileSystem = require("../../config/PartFileSystem"),
    util = require('util');

async function create3DFile(chemin, file) {

    let filePath = path.join(chemin, partFileSystem.data, file.originalname);
    try {
        let newFile = fs.writeFileSync(filePath, file.buffer.toString());
        let pathConvertedFile = converter.JSimport(filePath);
        console.log(pathConvertedFile);
        console.log("path here : " + filePath);
        console.log(newFile);
    } catch (err) {
        console.error(err);
        return {status : 500, message: "Intern Error"}
    }
    try {
        let pathConvertedFile = converter.JSimport(filePath);
        console.log(pathConvertedFile);
        console.log("path here : " + filePath);
    } catch (err) {
        console.error(new Error(err));
        return {status : 500, message: "Intern Error"}
    }
    return;
}

module.exports = create3DFile;
