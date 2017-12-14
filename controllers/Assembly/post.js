const Assembly = require("../../models/Assembly");
const Node = require("../../models/Node");
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const type_mime = require('../../utils/type-mime');
const TypeEnum = require('../../enum/NodeTypeEnum');
const createFile = require('../utils/createFile');
const deleteFile = require('../utils/deleteFile');
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
    let nodeId =    escape(req.params.nodeId),
    name =          escape(req.body.name),
    description =   escape(req.body.description),
    tags =          escape(req.body.tags),
    breadcrumb =    escape(req.body.breadcrumb),
    sub_level =     escape(req.body.sub_level) + 1,
    specFiles =     req.files['specFiles'],
    file3D =        req.files['file3D'][0];

    const documentID = String(require('mongoose').Types.ObjectId());

    let promiseType = {
        specFiles: [],
        file3D: [type_mime(0, file3D.mimetype)],
    };

    let promiseCreateFile = {
        specFiles: [],
        file3D: [createFile(config.gitfiles, documentID, file3D.originalname, file3D.buffer)]
    };

    let promiseDeleteFile = [deleteFile(config.gitfiles, documentID, file3D.originalname)];

    let relativePath = {
        specFiles: [],
        file3D: path.join(documentID, file3D.originalname)
    };

    specFiles.forEach(spec => {
        relativePath.specFiles.push(path.join(nodeId, spec.originalname));
        promiseCreateFile.specFiles.push(createFile(config.specfiles, nodeId, spec.originalname, spec.buffer));
        promiseDeleteFile.push(deleteFile(config.specfiles, nodeId, spec.originalname));
        promiseType.specFiles.push(type_mime(1, spec.mimetype))
    });

    Node.findById(nodeId)
    .then((parentNode) => {
        if (!parentNode)
        res.status(404).send("Not Found");
        else if (parentNode.type !== TypeEnum.assembly)
        res.status(401).send("The node is a " + parentNode.type + ", it should be an " + TypeEnum.assembly);
        else {
            // Promise The specFiles
            Promise.all(promiseType.specFiles)
            .then(() => {
                //Promise the creation of the Files
                return Promise.all(promiseCreateFile.specFiles)
            })
            .then(() => {console.log("SpecFiles created")})
            .catch(err => {
                console.log(new Error("[Function newPart] The file 3D does'nt respect the type-mime - " + err));
                throw err;
            });
            // Promise The file3D
            Promise.all(promiseType.file3D)
            .then(() => {
                //Promise the creation of the Files
                return Promise.all(promiseCreateFile.file3D);
            })
            .then(() => {console.log("File3D created")})
            .catch(err => {
                console.log(new Error("[Function newPart] The file 3D does'nt respect the type-mime - " + err));
                throw err;
            });

            let assembly = Assembly.initialize(name, description, relativePath.file3D, relativePath.specFiles, tags);
            //assembly = new Assembly(assembly);
            assembly.save()
            .then((newAssembly) => {
                let subNode = Node.createNode(name, description, TypeEnum.assembly, newAssembly._id, relativePath.specFiles, tags);
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
        Promise.all(promiseDeleteFile)
        .then(() => {
            res.status(500).send("Intern Error");
        })
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