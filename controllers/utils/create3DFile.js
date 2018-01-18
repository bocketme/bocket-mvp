const fs = require('fs'),
    path = require('path'),
    file_accepted = require('../../utils/extension_file'),
    converter = require("../../convertisseur/convertisseur"),
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

                try {
                    /*
                    let geometryJSON = converter.exec(path.join(chemin, partFileSystem.rawFile,nameFile));
                    fs.writeFile(path.join(chemin, partFileSystem.data, _nameFile + ".json"), JSON.stringify(geometryJSON), (err) => {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                    })
                    */
                } catch (e) {
                    console.log(e);
                }

                //TODO: Change the data with geometry.json
                fs.writeFile(path.join(chemin, partFileSystem.data, _nameFile + ".json"), data, (err) => {
                    if (err)
                        return reject(err);
                });
                resolve();
            })
        })

    })
}
module.exports = create3DFile;