let accepted_3d = [];
let accepted_spec = [];

/**
* Promise who verify the TYPE MIME OF A FILE
* 
* @param {number} mode - 0 => Mode files 3D - 1 => Mode spec Files 
* @param {String} type_mime - Send only the TYPE_MIME
* @returns {Promise}
*/
function TypeMIME(mode, type_mime) {
    return new Promise((resolve, reject) => {
        resolve();
        /*
        if (mode == 0) { // Mode files 3D
            accepted_3d.forEach(file3d => {
                if (file3d == type_mime)
                resolve();
            })
        } else if (mode == 1) { // Mode specFiles
            accepted_spec.forEach(spec => {
                if (spec == type_mime)
                resolve();
            })
        } else reject(new Error("You have send the wrong mode"));
        reject("Wrong Type MIME");
        */
    })
}
module.exports = TypeMIME;