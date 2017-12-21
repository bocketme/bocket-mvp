const Node = require('../models/Node');
const Assembly = require('../models/Assembly');
const Part = require('../models/Part');
const TypeEnum = require('../enum/NodeTypeEnum');
const twig = require('twig');
const path = require('path');
const config = require('../config/server');
const fs = require('fs');

module.exports = socket => {
    function readFile3d(wayToFIle){
        fs.readFile(path.join(config.gitfiles, wayToFIle), (err, data) => {
            if (err){
                console.log(err);
                socket.emit('nodeError', "Couldn't Find the part");
                return;
            } else {
                return data;
            }
        })
    }

    socket.on("getPart", (nodeId) => {
        console.log("Get Part");
        Node.findById(nodeId)
        .then((node) => {
            Part.findById(node.content)
            .then((partSelected) => {
                fs.readFile(path.join(config.gitfiles, partSelected.path), 'utf8', (err, data) => {
                    console.log(path.join(config.gitfiles, partSelected.path));
                    socket.emit('contentInformation', partSelected);
                    socket.emit('contentFile3d', data);
                })
            })
        })
    });

    socket.on("getAssembly", (nodeId) => {
        console.log("Get Part");
        Node.findById(nodeId)
        .then((node) => {
            Assembly.findById(node.content)
            .then((assemblySelected) => {
                fs.readFile(path.join(config.gitfiles, assemblySelected.path), 'utf8',(err, data) => {
                    socket.emit('contentInformation', assemblySelected);
                    socket.emit('contentFile3d', data);
                })
            })
        })
    });
};
