const Assembly = require("../../models/Assembly");
const Node = require("../../models/Node");
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const type_mime = require('../../utils/type-mime');
const TypeEnum = require('../../enum/NodeTypeEnum');
const createFile = require('../utils/createFile');
const create3DFile = require('../utils/create3DFile');
const twig = require('twig');

/********************************************************/
/*                                                      */
/*                                                      */
/*                     Controllers                      */
/*                                                      */
/*                                                      */
/********************************************************/

/**
 * Create a new Part for the specified node
 */
const newAssembly = (req, res) => {

    let nodeId = escape(req.params.nodeId),
        name = escape(req.body.name),
        description = escape(req.body.description),
        tags = escape(req.body.tags),
        sub_level = escape(req.body.sub_level) + 1,
        breadcrumb =    escape(req.body.breadcrumb),
        specFiles = req.files['specFiles'],
        files_3d = req.files['file3D'],
        sendError = [];

    const documentID = String(require('mongoose').Types.ObjectId());

    let relativePath = {
        specFiles: [],
        file3D: []
    };

    if(specFiles){
        specFiles.forEach(spec => {
            type_mime(1, spec.mimetype)
                .then(() => {
                    return createFile(config.specfiles, nodeId, spec.originalname, spec.buffer);
                })
                .then(() => {
                    relativePath.specFiles.push(path.join(nodeId, spec.originalname));
                    return;
                })
                .catch(err => {
                    console.log(err);
                    sendError.push("Could'nt create the file : " + spec.originalname)
                });
        });
    }

    if(files_3d){
        files_3d.forEach(file => {
            type_mime(0, file.mimetype)
                .then(() => {
                    return create3DFile(config.gitfiles, documentID, file.originalname, file.buffer)
                })
                .then((fileName) => {
                    relativePath.file3D.push(path.join(documentID, fileName));
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    sendError.push("Could'nt create the file : " + file.originalname);
                });
        });
    }

    Node.findById(nodeId)
        .then((parentNode) => {
            if (!parentNode)
                res.status(404).send("Not Found");
            else if (parentNode.type !== TypeEnum.assembly)
                res.status(401).send("The node is a " + parentNode.type + ", it should be an " + TypeEnum.assembly);
            else {
                let assembly = Assembly.initialize(name, description, relativePath.file3D, relativePath.specFiles, tags);
                assembly.save()
                    .then((newAssembly) => {
                        let subNode = Node.createNodeWithContent(name, description, TypeEnum.assembly, newAssembly._id, relativePath.specFiles, tags);
                        subNode.save()
                            .then((subNode) => {
                                parentNode.children.push({
                                    _id: subNode._id,
                                    type: subNode.type,
                                    name: subNode.name,
                                });
                                parentNode.save()
                                    .then(() => {
                                        parentNode.children.forEach(child => {
                                            child.breadcrumb = breadcrumb + '/' + child.name
                                        });
                                        twig.renderFile('./views/socket/three_child.twig', {
                                            node: parentNode, TypeEnum: TypeEnum,sub_level: sub_level}, (err, html) => {
                                            if (err)
                                                console.log(err);
                                            res.send(html)
                                        });
                                    })
                                    .catch((err) => {
                                        console.log("[Function newPart] Could'nt save the node Parent - " + err);
                                        throw err;
                                    })
                            })
                            .catch(err => {
                                console.log("[Function newPart] Could'nt save the Sub node - " + err);
                                throw err;
                            });
                    })
                    .catch(err => {
                        console.log(new Error("[Function newPart] Could'nt save the part"));
                        throw err;
                    });
            }
        })
        .catch(() => {
            res.status(500).send("Internal Error");
        });
};

/********************************************************/
/*                                                      */
/*                                                      */
/*                      Modules                         */
/*                                                      */
/*                                                      */
/********************************************************/


var controllerPOST = {
    newAssembly: newAssembly
};

module.exports = controllerPOST;