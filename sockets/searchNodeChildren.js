const Node = require('../models/Node');
let TypeEnum = require('../enum/NodeTypeEnum');
let twig = require('twig');

module.exports = (socket) => {
    socket.on("nodeChildren", (nodeId, breadcrumbs, sub_level) => {
        Node.findById(nodeId)
            .then((node) => {
                console.log(node.name);
                console.log(node.children);
                node.children.forEach(child => {
                    if(child.title)
                        child.name = child.title;
                        child.breadcrumb = breadcrumbs + '/' + child.name;
                    });
                sub_level++
                console.log(sub_level);
                twig.renderFile('./views/socket/three_child.twig', {
                    node: node,
                    TypeEnum: TypeEnum,
                    sub_level: sub_level
                }, (err, html) => {
                    if (err)
                        console.log(err);
                    socket.emit("nodeChild", html, nodeId);
                });
            });
    });
}