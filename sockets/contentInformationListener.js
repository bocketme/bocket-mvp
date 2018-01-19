const Node = require('../models/Node');
const Assembly = require('../models/Assembly');
const Part = require('../models/Part');
const TypeEnum = require('../enum/NodeTypeEnum');
const twig = require('twig');
const path = require('path');
const config = require('../config/server');
const fs = require('fs');

module.exports = socket => {
    socket.on("getPart", (nodeId) => {
        console.log("Get Part");
        Node.findById(nodeId)
        .then((node) => {
            Part.findById(node.content)
            .then((partSelected) => {
                fs.readFile(path.join(config.files3D, partSelected.path), 'utf8', (err, data) => {
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
                fs.readFile(path.join(config.files3D, assemblySelected.path), 'utf8',(err, data) => {
                    socket.emit('contentInformation', assemblySelected);
                    socket.emit('contentFile3d', data);
                })
            })
        })
    });
};
