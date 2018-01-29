const fs = require('fs'),
    path = require('path'),
    partFileSystem = require('../../config/PartFileSystem');
    file_accepted = require('../../utils/extension_file');

function create3DFile(chemin, nameFile, data){
    return new Promise((resolve, reject) => {
        fs.access(chemin, err => {
            if(err)
                    return reject(err);
            fs.writeFile(path.join(chemin, partFileSystem.rawFile,nameFile), data.toString(), err => {
                if (err)
                    return reject(err);
                resolve();
            })
        })
    })
}

module.exports = create3DFile;