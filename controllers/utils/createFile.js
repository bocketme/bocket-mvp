const fs = require('fs'),
    path = require('path'),
    partFileSystem = require("../../config/PartFileSystem");

function createFile(chemin, nameFile, data) {
    console.log("createFile = ",nameFile);
    return new Promise((resolve, reject)=> {
        data = data.toString();
        fs.writeFile(path.join(chemin, partFileSystem.spec, nameFile), data, err => {
            if (err)
                return reject(err);
            resolve();
        })
    });
}

module.exports = createFile;