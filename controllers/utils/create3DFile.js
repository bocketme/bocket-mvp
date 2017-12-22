const fs = require('fs'),
path = require('path'),
file_accepted = require('../../utils/extension_file');
let converter = require("../../convertisseur/convertisseur");

function create3DFile(access, id, nameFile, data) {
return new Promise((resolve, reject)=> {
    data = data.toString();
    let access_path = path.resolve(access);
    let node_path = path.join(access, id);
    let file_path = path.join(access, id, nameFile);
    let arrayOfNameFile = nameFile.split('.');
    let _nameFile = "";

    _nameFile = nameFile.match("[^.*]+");

    fs.access(access_path, (err) => {
        if (err) reject(err);
        fs.access(node_path, (err) => {
            if (err){
                fs.mkdir(node_path, (err) => {
                    if(err)
                        reject(new Error(err));
                    else {
                        fs.writeFile(file_path, data, (err) => {
                            if (err)
                                reject(new Error(err));
                            else {
                                console.log(nameFile + " created in : " + file_path);
                                try {
                                    let geometryJSON = converter.exec(file_path);
                                    console.log("converter result : " + geometryJSON);
                                    console.log("path Join : " + path.join(node_path, String(_nameFile +".json")));
                                    fs.writeFile(path.join(node_path, _nameFile +".json"), JSON.stringify(geometryJSON), (err) => {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        }
                                    })
                                    // geometryJSON is the geometry readable by THREE.JS
                                } catch (e) {
                                    console.log(e);
                                }
                                resolve(_nameFile +".json");
                            }
                        });
                    }
                });
            }
        });
    })
});
}

module.exports = create3DFile;