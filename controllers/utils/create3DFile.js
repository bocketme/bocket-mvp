const fs = require('fs'),
    path = require('path'),
    file_accepted = require('../../utils/extension_file'),
    //converter = require("../../convertisseur/converter"),
    partFileSystem = require("../../config/PartFileSystem");

function create3DFile(chemin, nameFile, data){
    return new Promise((resolve, reject) => {
        let _nameFile = nameFile.match("[^.*]+")[0];
        data = data.toString();
        fs.access(chemin, err => {
            if(err)
                    return reject(err);
            fs.writeFile(path.join(chemin, partFileSystem.rawFile,nameFile), data, err => {
                if (err)
                    return reject(err);
                /*
                    try {
                    console.log("path here : " + path.join(chemin, partFileSystem.rawFile, nameFile));
                    let pathConvertedFile = converter.JSimport(path.join(chemin, partFileSystem.rawFile, nameFile));
                    console.log(pathConvertedFile);
                } catch (e) {
                    console.log(e);
                }
                */
                resolve();
            })
        })
    })
}

module.exports = create3DFile;