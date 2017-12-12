const fs = require('fs'),
    path = require('path');

function createFile(access, nodeId, nameFile, data) {
    return new Promise((resolve, reject)=> {
        let access_path = path.resolve(access);
        let node_path = path.join(access, nodeId);
        let file_path = path.join(access, nodeId, nameFile);
        fs.access(access_path, (err) => {
            if (err) reject(err);
            fs.access(node_path, (err) => {
                if (err){
                    fs.mkdir(node_path, (err) => {
                        if(err)
                            reject(err);
                    });
                }
                fs.writeFile(file_path, data.toString, (err) => {
                    if (err)
                        reject(err);
                    else {
                        console.log(nameFile + " created in : " + file_path);
                        resolve();
                    }
                })
            });
        })
    });
}

module.exports = createFile;