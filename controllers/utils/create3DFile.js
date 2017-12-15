const fs = require('fs'),
path = require('path'),
file_accepted = require('../../utils/extension_file');
//let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');
// let plugin_path = "converter/bocket-plugin/module/bocket-moduleExample/libBocketAssimp.so";

function create3DFile(access, id, nameFile, data) {
return new Promise((resolve, reject)=> {
    data = data.toString;
    let access_path = path.resolve(access);
    let node_path = path.join(access, id);
    let file_path = path.join(access, id, nameFile);
    let arrayOfNameFile = nameFile.split('.');
    let _nameFile = "";
    arrayOfNameFile.forEach(splitName => {
        _nameFile.concat(splitName);
    });

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
                                //Module
                                console.log(nameFile + " created in : " + file_path);
                                /*
                                try {
                                    let module = new Plugin(plugin_path);
                                    let geometryJSON = module.run(data);
                                    fs.writeFile(path.join(node_path, _nameFile +".json"), geometryJSON, (err) => {
                                        if (err)
                                            throw err;
                                    })
                                    // geometryJSON is the geometry readable by THREE.JS
                                } catch (e) {

                                }
                                module.release();
                                resolve(_nameFile +".json");
                                */
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