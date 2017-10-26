var Promise = require('promise'),
    request = require('request');



var getNodeChild = (id_node) => {
    return new Promise((resolve, reject) => {
        request.get("http://localhost:8080/api/node/search/child/".concat(id_node), (err, res, body) => {
            if (err)
                reject(error);
            else if (!err && res.statusCode == 200)
                resolve({
                    node_parent: id_node,
                    node_child: body
                });
            else if (res.statusCode == 400)
                resolve(null);
            else if (res.statusCode == 500)
                resolve(null);
        });
    });
};
var recursive = function recommencer(id_node, result) {
    getNodeChild(id_node)
        .catch((err) => { return null })
        .done((res) => {
            if (res instanceof Object) {
                res.node_child = JSON.parse(res.node_child);
                for (var element of res.node_child) {
                    result.push({
                        node_parent: res.node_parent,
                        node_child: element.id
                    });
                    recommencer(element.id, result);
                }
                return result;
            }
        });
};
ara = recursive(1, [1]);
console.log("ara : ", ara);