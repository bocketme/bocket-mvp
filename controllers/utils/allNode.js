const Node = require('../../models/Node');
const lastUpdates = require('./lastUpdates');

/**
 * Search the number of node
 * @param masterId
 */
module.export = function (masterId) {
    nodeChildren(masterId)
        .then(numberofNode => {
            return numberofNode;
        });
};

function nodeChildren (nodeId){
    return new Promise((resolve, reject) => {
        Node.findById(nodeId)
            .then(node => {
                if(!node.children){
                    resolve(1);
                    return;
                }
                let promises = [];
                node.children.forEach(child => {
                    promises.push(nodeChildren(child._id));
                });
                Promise.all(promises);
            })
            .then((children) => {
                let nodehasChild = 1;
                children.forEach(child => {
                    nodehasChild += child;
                });
                resolve(nodehasChild);
            })
    })
}