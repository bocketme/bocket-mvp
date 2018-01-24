
// let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');
//let plugin = require('../converter/bocket-plugin/build/Release/plugin.node');

// let plugin_path = "converter/bocket-plugin/module/bocket-moduleExample/libmoduleExample.dylib";

let Node = require('../models/Node');
let escape = require('escape-html');
let Workspace = require('../models/Workspace');

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
        res.send('noting to see')
    },
    update: function (req, res){
        
        //let module = new plugin(plugin_path);
        //let obj = module.run("cube");
        //module.release();
        let obj = "bonjour";
        res.send({geometry : obj});
    },
    newPart: (req, res) => {
        console.log(req.body);
        res.json(req.body);
    },
    newChild: (req, res) => {
        let workspaceId= req.params.workspaceId
        let cible = req.body.cible;
        let title = req.body.title;

        Workspace.findById({_id: workspaceId})
            .then(work => {
                if (work !== null){
                    updateNode(work.node_master, cible, title)
                    .then(node => {
                        work.node_master = node
                        //console.log(node);                
                        work.save()
                        .catch(err => {
                            console.log(err);
                        });
                        res.send();
                    })
                } else res.status(404).send("Not Found");
            })
            .catch(error => {
                console.log(e)
                res.send(e);
            })
    }
};

function updateNode(node, cible, title) {
    return new Promise((resolve, reject) => {
        if (node.children.length !== 0){
            console.log("je repasserai par là")
            let children = []
            node.children.forEach(child => {
                updateNode(child, cible, title)
                    .then(childNode => children.push(childNode));
            });
            node.children = children;
        }
        if (node._id == cible) {
            console.log("Un nouveau noeud a été poussé");
            node.children.push({
                title: title,
                children: [],
            });
        }
        resolve(node);
    });
}

module.exports = nodeController;