const fs = require('fs'),
    path = require('path'),
    partFileSystem = require('../../config/PartFileSystem');
    file_accepted = require('../../utils/extension_file');

function create3DFile(chemin, file){
    return new Promise((resolve, reject) => {
        fs.access(chemin, err => {
            if(err)
                    return reject(err);
            fs.writeFile(path.join(chemin, partFileSystem.rawFile,file.originalname), file.buffer.toString(), err => {
                if (err)
                    return reject(err);
                resolve();
            })
        })
    })
}

module.exports = create3DFile;
