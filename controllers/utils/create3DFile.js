const fs = require('fs');
const path = require('path');
const converter = require('bocket_converter');
const partFileSystem = require("../../config/PartFileSystem");
const log = require('../../utils/log');
const optionStream = {
  flags: 'w',
  encoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
};

async function create3DFile(chemin, file) {
  const filePath = path.join(chemin, partFileSystem.data, file.originalname);
  const file3D = fs.createWriteStream(filePath, optionStream);

  file3D.end(file.buffer);

  file3D.on('close', () => {
    console.log('in the if ');
    if (converter) {
      return converter.JSimport(filePath);
    }
  });
  file3D.on('finish', () => {
    console.log('in the if ');
    if (converter) {
      return converter.JSimport(filePath);
    }
  });
}

module.exports = create3DFile;
