
let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');

let plugin_path = "converter/bocket-plugin/module/bocket-moduleExample/libmoduleExample.dylib";

let nodeController = {

    index : function(req, res) {
        let module = new plugin(plugin_path);
        let obj = module.run("cube");
        module.release();
        res.send({geometry : obj});
    }
};

module.exports = nodeController;