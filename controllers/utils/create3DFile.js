const fs = require('fs'),
path = require('path');
//let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');
// let plugin_path = "converter/bocket-plugin/module/bocket-moduleExample/libBocketAssimp.so";

function create3DFile(access, id, nameFile, data) {
return new Promise((resolve, reject)=> {
    let access_path = path.resolve(access);
    let node_path = path.join(access, id);
    let file_path = path.join(access, id, nameFile);
    fs.access(access_path, (err) => {
        if (err) reject(err);
        fs.access(node_path, (err) => {
            if (err){
                fs.mkdir(node_path, (err) => {
                    if(err)
                        reject(new Error(err));
                    else {
                        fs.writeFile(file_path, data.toString, (err) => {
                            if (err)
                                reject(new Error(err));
                            else {
                                console.log(nameFile + " created in : " + file_path);
                                resolve();
                            }
                        });
                    }
                });
            }
            // call converter here, data represent file content
            //try {
                // let module = new plugin(plugin_path);
                // let geometryJSON = module.run(data);
                // geometryJSON is the geomatry readable by THREE.js
            //} catch () ...
            // module.release();
        });
    })
});
}

module.exports = create3DFile;