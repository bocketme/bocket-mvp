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

    socket.on("searchNodeChild", (nodeId) => {
        console.log('[SOCKET search NodeChild] : Activated')
        Node.findById(nodeId)
            .then((node) => {
                twig.renderFile('./views/socket/three_child.twig', {node: node, TypeEnum: TypeEnum}, (err, html) => {
                    if(err)
                        console.log(err);
                    console.log(html);
                    socket.emit("nodeChild", html, nodeId);
                });
            });
        console.log('[SOCKET search NodeChild] : Finished');
    });
};