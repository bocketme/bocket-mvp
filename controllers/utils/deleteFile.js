const path = require('path'),
    fs = require('fs');

function deleteFile(access, nodeId, nameFile) {
    return new Promise((resolve, reject) => {
        let wayToFile = path.join(access, nodeId, nameFile);
        fs.stat(wayToFile, (err) => {
            if (err)
                console.log("DELETE FILE : " + nameFile + " doesn't exist ");
            fs.unlink(wayToFile, (err) => {
                if (err)
                    console.log("The File " + nameFile + " inside the directory " + wayToFile + " could'nt be erased");
                else
                    resolve();
            })
        })
    });
}

module.exports = deleteFile;