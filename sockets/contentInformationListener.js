const Node = require('../models/Node');
const Assembly = require('../models/Assembly');
const Part = require('../models/Part');

module.exports = socket => {
    socket.on("getPart", (nodeId) => {
        Node.findById(nodeId)
        .then((node) => {
            Part.findById(node.content)
            .then((partSelected) => {
                socket.emit('contentInformation', partSelected)
            })
        })
    });

    socket.on("getAssembly", (nodeId) => {
        Node.findById(nodeId)
        .then((node) => {
            Assembly.findById(node.content)
            .then((assemblySelected) => {
                socket.emit('contentInformation', assemblySelected);
            })
        })
    });

    socket.on("nodeChildren", (nodeId) => {
        Node.findById(nodeId)
        .then((node) => {
            if(node !== null) {
                console.log("node = ", node.children);
                socket.emit('seeChildrenNode', nodeId, node.children);
            }
        })
    });
};