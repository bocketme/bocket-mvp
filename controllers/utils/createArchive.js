const fs = require('fs'),
path = require('path'),
archiver = require('archiver'),
PartFileSystem = require('../../config/PartFileSystem');

function createArchive(partPath, partName){
    let output = fs.createWriteStream(path.join(partPath, PartFileSystem.import, partName + Date.now() + ".zip")),
    archive = archiver('zip');

    archive.on('error', function(err) {
        return err;
    });

    archive.pipe(output);

    fs.readdir(path.join(partPath, PartFileSystem.rawFile), (err, files) => {
        if (err)
            return (err)
        for(let i = 0; i<files.length; i++){
            archive.append(fs.createReadStream(path.join(partPath, PartFileSystem.rawFile, files[i])), { name: files[i] });
        }
        archive.finalize();
    });
    return;
}

module.exports = createArchive;