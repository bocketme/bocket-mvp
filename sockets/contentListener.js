const Node = require('../models/Node');
const Assembly = require('../models/Assembly');
const Part = require('../models/Part');

module.exports = socket => {
    socket.on("getPart", (nodeId) => {
        Node.findById(nodeId)
            .then((node) => {
            Part.findById(node.content)
                .then((partSelected) => {
                    var content = {
                        name: partSelected.name,
                        maturity: partSelected.maturity,
                        owners: partSelected.owners,
                        whereUsed: partSelected.whereUsed,
                        quality: partSelected.quality
                    };
                    socket.emit("contentInformation", content);
            })
        })
    });

    socket.on("getAssembly", () => {
        Node.findById(nodeId)
        .then((node) => {
        Assembly.findById(node.content)
            .then((assemblySelected) => {
                var content = {
                    name: assemblySelected.name,
                    maturity: assemblySelected.maturity,
                    owners: assemblySelected.owners,
                    whereUsed: assemblySelected.whereUsed,
                    quality: assemblySelected.quality
                };
                socket.emit("contentInformation", content);
            })
        });
    });

    socket.on("searchNodeChild", (nodeId) => {
        Node.findById(nodeId);
        .then((node) => {
            var bool_child = node.children === [];
            var children = [];
            node.children.forEach(child => {
                children.push({
                    title: node_master.children[i].title,
                    _id: node_master.children[i]._id,
                })
            });
            socket.emit("", (children,nodeId));
        });
    });
};