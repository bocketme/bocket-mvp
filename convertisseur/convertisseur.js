/**
 * Created by jean-adriendomage on 14/12/2017.
 */

//let system = require("./system");
//let nodePlugin = require(system.moduleNode);

/**
 * @name fileConverter
 * @details On error the field error is set in the jsonObject.
 * @param filePath
 * @return JSON Object
 */

function fileConverter(filePath) {
    let module = "";
    let geometry = {
        error : "Invalid path or module not found"
    };
    expr = filePath.match(".native");
    if (expr !== null)
        expr = expr[0];
    switch (expr) {
        case ".native" :
            module = system.module[0].path;
            break;
        default:
            module = system.module[1].path;
    }
    try {
        let plugin = new nodePlugin(module, "");
        geometry = plugin.run(filePath);
        console.log(geometry);
        delete (plugin);
    }
    catch (e) {
        console.log(e)
    }
    return geometry;
}

let converter = {
    exec : fileConverter
};

module.exports = converter;