const fs = require('fs');
const path = require('path');
const converter = require("../../converter/converter");
const partFileSystem = require("../../config/PartFileSystem");
const log = require('../../utils/log');
const optionStream = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
};

const converterInfo = log.child({ type: converter });

async function create3DFile(chemin, file) {
  const filePath = path.join(chemin, partFileSystem.data, file.originalname);
  const file3D = fs.createWriteStream(filePath, optionStream);

  file3D.end(file.buffer);

  file3D.on('close', () => {
    console.log('in the if ');
    if (converter) {
      const resultImport = converter.JSimport(filePath);
      console.log('Import File 3D : ', resultImport);
      converterInfo.info(resultImport);
    }
  });
}

module.exports = create3DFile;
