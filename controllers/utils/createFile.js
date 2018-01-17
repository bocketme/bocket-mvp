const fs = require('fs'),
    path = require('path'),
    partFileSystem = require("../../config/PartFileSystem");

function createFile(chemin, nameFile, data) {
    console.log("createFile = ",nameFile);
    return new Promise((resolve, reject)=> {
        data = data.toString();
        fs.access(chemin, err => {
            if(err)
                return reject(err);
            fs.writeFile(path.join(chemin, partFileSystem.spec, nameFile), data, err => {
                if (err)
                    return reject(err);
                console.log(nameFile, ' : ok');
                resolve();
            })
        })
    });
}

module.exports = createFile;