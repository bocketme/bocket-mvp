/**
 * Created by jean-adriendomage on 14/12/2017.
 */

/**
 * @file system.js
 * @details This file containing some predefine path between different os.
 */

let macOs = {
    moduleNode : "./release/macOs/plugin.node",
    module : [
        {
            "name" : "native",
            "path" : "./release/modules/macOs/libmoduleExample.dylib"
        },
        {
            "name" : "assimp",
            "path" : "/Users/jean-adriendomage/devops/application-web/bocket-mvp/convertisseur/release/modules/macOs/libBocketAssimp.dylib"
        }
    ]
};

let linux = {

};

module.exports= macOs;