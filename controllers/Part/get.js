const Node = require('../../models/Node');
const Part = require('../../models/Part');
const TypeEnum = require('../../enum/NodeTypeEnum');

let modeler = (req, res) => {
    let nodeId = req.params.nodeId;
    Node.findById(nodeId)
        .then((node) => {
            if (TypeEnum.part = node.type) {
                Part.findById(node.content)
                    .then((part) => {
                            res.render('part-modeler', { title: part.name });
                    })
                    .catch((err) => {
                        console.error(err);
                        res.status(500);
                        res.send('Intern Error');
                    })
            } else {
                res.status(404);
                res.send('Not Found');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500);
            res.send('Intern Error');
        });
};

const controllerGet = {
    modeler : modeler
};

module.exports = controllerGet;
