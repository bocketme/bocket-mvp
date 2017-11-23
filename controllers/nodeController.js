
// let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');
//let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');

// let plugin_path = "converter/bocket-plugin/module/bocket-moduleExample/libmoduleExample.dylib";

let nodeController = {

    index : function(req, res) {
        // let module = new plugin(plugin_path);
        // let obj = module.run("cube");
        // module.release();
        res.send({geometry : require('../test/converter.json')});
    },
    post: function(req, res){

    },
    get: function(req, res){

    },
    update: function (req, res){
        
        //let module = new plugin(plugin_path);
        //let obj = module.run("cube");
        //module.release();
        let obj = "bonjour";
        res.send({geometry : obj});
    }
    
};

module.exports = nodeController;