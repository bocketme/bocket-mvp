import { Promise, Error } from "mongoose";
import { error } from "../../../../../.cache/typescript/2.6/node_modules/@types/three";
import { start } from "repl";

const Part = require("../../models/Part");
const NodeSchema = require("../../models/Node");
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const type_mime = require('../../utils/type-mime');
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

    let Documents;

    sub_level++;
    NodeSchema.findById(nodeId)

        .then((parentNode) => {
            if (!parentNode)
                Promise.reject(new Error({ status: 404, message: "Node not Found" }))
            else if (parentNode.type !== NodeTypeEnum.assembly)
                Promise.reject(new Error({ status: 401, message: "The node is a " + parentNode.type + ", it should not be an " + NodeTypeEnum.assembly }))
            else
                return Assembly.findById(parentNode.content)
        })

        .catch((err) => {
            console.error("Cannot Find The Assembly Parent");
            return Promise.reject({ status: 404, message: "Parent Assembly Not Found" });
        })

        .then((parentAssembly) => {
            if (!parentAssembly)
                return Promise.reject(new Error({ status: 404, message: "Assembly not Found" }));
            Documents.parentAssembly = parentAssembly;

            let part = Part.newDocument({
                name: name,
                description: description,
                tags: tags,
                ownerOrganization: parentAssembly.ownerOrganization,
            });

            return part.save();
        })

        .catch(err => {
            console.error(new Error("[Function newPart] Could'nt save the part \n" + err));
            return Promise.reject(new Error({ status: 500, message: "Cannot save the part" }));
        })

        .then((newPart) => {
            Documents.newPart = newPart;

            let subNode = NodeSchema.newDocument({
                name: name,
                description: description,
                type: NodeTypeEnum.part,
                content: newPart._id,
                Workspaces: parentNode.Workspaces,
                tags: tags,
                team: parentNode.team,
            });

            return subNode.save();
        })
        
        .catch(err => {

            console.error(new Error("[Function newPart] Could'nt save the subnode \n" + err));
            return Promise.reject(new Error({ status: 500, message: "Cannot save the node child" }));
        
        })
        
        .then((subNode) => {
            Documents.subNode = subNode;

            Documents.parentNode.children.push({
                _id: subNode._id,
                type: subNode.type,
                name: subNode.name,
            });

            Documents.parentNode.save();
        })

        .catch(err => {
            console.error(new Error("[Function newPart] Could'nt save the parent Node \n" + err));
            return Promise.reject(new Error({ status: 500, message: "Cannot save the modification to the parent Node" }));
        })

        .then((newParentNode) => {
            newParentNode.children.forEach(child => {
                child.breadcrumb = breadcrumb + '/' + child.name
            });
            twig.renderFile('./views/socket/three_child.twig', {
                node: newParentNode,
                TypeEnum: NodeTypeEnum,
                sub_level: sub_level,
                breadcrumb: breadcrumb,
                sockets: [{
                    message: "The node " + subNode._id + "was created. Converting...",
                    order: "[Converter Import] - Start",
                    dataToSend: [subNode._id, files_3d[0].originalname],
                }]
            }, (err, html) => {
                if (err)
                    console.log(err);
                return new Promise((resolve, reject) => {
                    createFiles(specFiles, files_3d, path.join(config.files3D, newPart.path), newPart.name);
                    resolve(html);
                })
            });
        })

        .then((html) => {
            res.send(html);
        })

        .catch(err => {
            let status = typeof(status) === "number" ? err.status : 500
            let message = typeof(message) === "string" ? err.status : message            
            Documents.newPart.remove();
            Documents.subNode.remove();
            res.status(status).send(message);
        })
    }

function createFiles(specFiles, files_3d, chemin, name) {
    let sendError = [];

    if (specFiles) {
        specFiles.forEach(spec => {
            type_mime(1, spec.mimetype)
                .then(() => {
                    return createFile(chemin, spec.originalname, spec.buffer);
                })
                .catch(err => {
                    console.log(err);
                    sendError.push("Could'nt create the file : " + spec.originalname)
                });
        });
    }

    if (files_3d) {
        for (let i = 0; i < files_3d.length; i++) {
            let file = files_3d[i];
            type_mime(0, file.mimetype)
                .then(() => {
                    return create3DFile(chemin, file.originalname, file.buffer);
                })
                .then(() => {
                    if (i == files_3d.length - 1)
                        return createArchive(chemin, name);
                })
                .catch((err) => {
                    console.error(err);
                    sendError.push("Could'nt create the file : " + file.originalname);
                });
        };
    }

    return (sendError)
}

var controllerPOST = {
    newPart: newPart
};

module.exports = controllerPOST;