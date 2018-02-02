const util = require('util');
const fs = require('fs');

const stats = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const rmdir = util.promisify(fs.rmdir);
const unlink = util.promisify(fs.unlink);

module.exports = deleteDirPromise;

async function deleteDirPromise(path) {
    try {
        stat = await stats(path);

        if (stat.isDirectory()) {

            files = await readdir(path);

            let promises = [];

            files.forEach(await async function (file) {
                let deletedFIle = await deleteDirPromise(path.join(path, file));
            });

            let deleteDir = await rmdir(path);

            if (deleteDir instanceof Error)
                throw deleteDir;

        } else {
            let file = await unlink(path);

            if (file instanceof Error)
                throw file;
        }

    } catch (err) {
        throw err
    }
    return;
}
