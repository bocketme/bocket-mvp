var Promise = require('promise'),
    request = require('request'),
    EventEmitter = require('events');

var getNumberNode = (id_project) => {
    return new Promise((resolve, reject) => {
        request.get("http://localhost:8080/api/project/number_node/".concat(id_project), (err, res, body) => {
            if (err)
                reject(error);
            else if (!err && res.statusCode == 200)
                resolve(JSON.parse(body));
            else if (res.statusCode == 400)
                resolve(null);
            else if (res.statusCode == 500)
                resolve(null);
        });
    });
};

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

var aoaz = (id_node) => {
    var result = [],
        i = 1,
        node_number,
        node_three = new EventEmitter();

    node_three.on('start', () => {});
    node_three.on('new_node', (data) => {
        result.push(data);
        console.log("result = ", result);
    });
    node_three.on('end', () => {
        console.log("Event end, result = ", result);
        return result;
    });

    var recursive = (id_node) => {
        getNodeChild(id_node)
            .catch((err) => {
                return null;
            })
            .done((res) => {
                if (res instanceof Object) {
                    res.node_child = JSON.parse(res.node_child);
                    for (var element of res.node_child) {
                        i++;
                        node_three.emit('new_node', {
                            node_parent: res.node_parent,
                            node_child: element.id
                        });
                    }
                }
                if (i == node_number)
                    recursive(element.id);
                else
                    node_three.emit('end');
            });
    };

    recursive(id_node);

};
aoaz(1);