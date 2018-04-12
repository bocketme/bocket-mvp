const fs = require('fs');
const path = require('path');
const file_accepted = require('../../utils/extension_file');
const converter = require("../../converter/converter");
const partFileSystem = require("../../config/PartFileSystem");
const util = require('util');
const log = require('../../utils/log');
const exclude = require('./excludeConverter')
const optionStream = {
    flags: 'w',
    encoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true
}

let converterInfo = log.child({type: converter});

async function create3DFile(chemin, file) {
    let filePath = path.join(chemin, partFileSystem.data, file.originalname);
    let file3D = fs.createWriteStream(filePath, optionStream);

    file3D.end(file.buffer);

    file3D.on("close", () => {
        if (exclude.find((ext) => {
          return ext === path.extname(file.originalname);
        }))
        let resultImport = converter.JSimport(filePath);
        console.log("Import File 3D : ", resultImport);
        converterInfo.info(resultImport);
    });
}

module.exports = create3DFile;
