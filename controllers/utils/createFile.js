const fs = require('fs'),
    path = require('path'),
    partFileSystem = require("../../config/PartFileSystem");

function createFile(chemin, file) {
    return new Promise((resolve, reject)=> {
        fs.writeFile(path.join(chemin, partFileSystem.spec, file.originalname), file.buffer.toString(), err => {
            if (err)
                return reject(err);
            resolve();
        })
    });
}

module.exports = createFile;