const Part = require("../../models/Part");
const NodeSchema = require("../../models/Node");
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');
const createFile = require('../utils/createFile');
const create3DFile = require('../utils/create3DFile');
const twig = require('twig');
const Assembly = require('../../models/Assembly');
const createArchive = require('../utils/createArchive');

/**
 * Create a new Part for the specified node
 */

const newPart = (req, res) => {

    let nodeId = escape(req.params.nodeId),
        name = escape(req.body.name),
        description = escape(req.body.description),
        tags = escape(req.body.tags),
        sub_level = Number(escape(req.body.sub_level)),
        breadcrumb = escape(req.body.breadcrumb),
        specFiles = req.files['specFiles'],
        files_3d = req.files['file3D'];

    let usedDocuments = {};
    let newDocuments = {};
    let _chemin;

    sub_level++;
    NodeSchema.findById(nodeId)

        .then((parentNode) => {
            if (!parentNode) {
                console.error("The node is not Found");
                Promise.reject({ status: 404, message: "Node not Found" })
            }
            else if (parentNode.type !== NodeTypeEnum.assembly) {
                console.error("The node is not Found");
                Promise.reject({ status: 401, message: "The node is a " + parentNode.type + ", it should not be an " + NodeTypeEnum.assembly });
            }
            else {
                usedDocuments.parentNode = parentNode;
                return Assembly.findById(parentNode.content)
            }
        })

        .catch((err) => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error("Cannot Find The Assembly Parent \n", err);
            return Promise.reject({ status: 404, message: "Parent Assembly Not Found" });
        })

        .then((parentAssembly) => {
            if (!parentAssembly)
                Promise.reject({ status: 404, message: "Assembly not Found" });

            usedDocuments.parentAssembly = parentAssembly;

            console.log(parentAssembly);

            let part = Part.newDocument({
                name: name,
                description: description,
                tags: tags,
                ownerOrganization: parentAssembly.ownerOrganization,
            });

            return part.save();
        })

        .catch(err => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Could'nt save the part \n" + err));
            return Promise.reject({ status: 500, message: "Cannot save the part" });
        })

        .then((newPart) => {
            newDocuments.newPart = newPart;

            _chemin = path.join(config.files3D, newPart.path);

            let subNode = NodeSchema.newDocument({
                name: name,
                description: description,
                type: NodeTypeEnum.part,
                content: newPart._id,
                Workspaces: usedDocuments.parentNode.Workspaces,
                tags: tags,
                team: usedDocuments.parentNode.team,
            });

            return subNode.save();
        })

        .catch(err => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Could'nt save the subnode \n" + err));
            return Promise.reject({ status: 500, message: "Cannot save the node child" });

        })

        .then((subNode) => {
            newDocuments.subNode = subNode;

            usedDocuments.parentNode.children.push({
                _id: subNode._id,
                type: subNode.type,
                name: subNode.name,
            });

            usedDocuments.parentNode.save();
        })

        .catch(err => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Could'nt save the parent Node \n" + err));
            return Promise.reject({ status: 500, message: "Cannot save the modification to the parent Node" });
        })

        .then(() => {
            let promises = [];
            if (specFiles) {
                specFiles.forEach(spec => {
                    promises.push(createFile(_chemin, spec));
                });
            }
            return Promise.all(promises);

        })
        .catch((err) => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Cannot create the spec\n" + err));
            return Promise.reject({ status: 500, message: "Cannot create the specFile" });
        })
        .then(() => {
            let promises = [];
            if (files_3d) {
                files_3d.forEach(file => {
                   promises.push(create3DFile(_chemin, file));
                });
            }
            return Promise.all(promises);
        })
        .catch((err) => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Cannot create the file3D\n" + err));
            return Promise.reject({ status: 500, message: "Cannot create the file3D" });
        })
        .then(() => {
            return createArchive(_chemin, name);
        })
        .catch((err) => {
            if (err.status && err.message)
                return Promise.reject(err);

            console.error(new Error("[Function newPart] Cannot create the archive of the node \n" + err));
            return Promise.reject({ status: 500, message: "Cannot create the archive of the node" });
        })
        /**
         * Twig - Front end formation
         */
        .then(() => {
            console.log(usedDocuments.parentNode);
            usedDocuments.parentNode.children.forEach(child => {
                child.breadcrumb = breadcrumb + '/' + child.name
            });
            twig.renderFile('./views/socket/three_child.twig', {
                node: usedDocuments.parentNode,
                TypeEnum: NodeTypeEnum,
                sub_level: sub_level,
                breadcrumb: breadcrumb,
                newNode: newDocuments.subNode._id,
                sockets: [{
                    message: "The node " + newDocuments.subNode.name + "was created. Converting...",
                    order: "[Converter Import] - Start",
                    dataToSend: [newDocuments.subNode._id, files_3d[0].originalname],
                }]
            }, (err, html) => {
                if (err){
                    console.error(err);
                    Promise.reject({status:500, message:"Network Error"})
                }
                res.send(html);
            });
        })

        .catch(err => {
            let status = typeof(err.status) === "number" ? err.status : 500;
            let message = typeof(err.message) === "string" ? err.status : message;

            let children = usedDocuments.parentNode.children;
            if(children[children.length-1]._id == newDocuments.subNode._id) {
                children.pop();
                usedDocuments.parentNode.save();
            }

            for (let document in newDocuments) {
                document.remove();
            }

            res.status(status).send(message);
        });
};

const controllerPOST = {
    newPart: newPart
};

module.exports = controllerPOST;