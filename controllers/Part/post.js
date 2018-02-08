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
const newPart = async (req, res) => {

    let nodeId = escape(req.params.nodeId),
        name = escape(req.body.name),
        description = escape(req.body.description),
        tags = escape(req.body.tags),
        sub_level = Number(req.body.sub_level),
        breadcrumb = escape(req.body.breadcrumb),
        specFiles = req.files['specFiles'],
        files_3d = req.files['file3D'];

    sub_level++;

    let parentNode;
    try {
        parentNode = await NodeSchema.findById(nodeId);

        if (!parentNode)
            throw { status: 404, message: "Not Found" };
        else if (parentNode.type !== NodeTypeEnum.assembly)
            throw { status: 401, message: "The node is a " + parentNode.type + ", it should not be an " + NodeTypeEnum.assembly };
    } catch (err) {
        let message = err.message ? err.message : "Error intern";
        let status = err.status ? err.status : "500";
        console.error("[ Post Part Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }

    let parentAssembly;
    try {
        parentAssembly = await Assembly.findById(parentNode.content);   
    } catch (err) {
        let message = err.message ? err.message : "Error intern";
        let status = err.status ? err.status : 500;
        console.error("[ Post Part Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }
    
    
    let part;
    try {
        part = Part.newDocument({
            name: name,
            description: description,
            tags: tags,
            ownerOrganization: parentAssembly.ownerOrganization,
        });
        
        part = await part.save();
    } catch (err) {
        part.remove();
        console.error("[ Post Part Controller ] \n" + new Error(err))
        return res.status(500).send("Error Intern");
    }

    let subNode;
    try {
        subNode = NodeSchema.newDocument({
            name: name,
            description: description,
            type: NodeTypeEnum.part,
            content: part._id,
            Workspaces: parentNode.Workspaces,
            tags: tags,
            team: parentNode.team,
        });
        subNode = await subNode.save();
    } catch (err) {
        part.remove();
        subNode.remove();
        console.error("[ Post Part Controller ] \n" + new Error(err));
        return res.status(500).send("Error Intern");
    }

    parentNode.children.push({
        _id: subNode._id,
        type: subNode.type,
        name: subNode.name,
    });

    let newParentNode;

  
    try {
        newParentNode = await parentNode.save()
    } catch (err) {
        part.remove();
        subNode.remove();
    }

    let chemin = path.join(config.files3D, newPart.path),
    sendError = [];

    if (specFiles) {
        specFiles.forEach(async function (spec) {
            try {
                await type_mime(1, spec.mimetype);
                await createFile(chemin, spec.originalname, spec.buffer);
            } catch (err) {
                sendError.push("Could'nt import the file : " + spec.originalname);
                console.log(err);
            }
        });
    }

    if (files_3d) {
        files_3d.forEach(async function (file) {
            try {
                await create3DFile(chemin, file.originalname, file.buffer);
            } catch (err) {
                sendError.push("Could'nt import the file : " + spec.originalname);
                console.log(err);
            }
        });
    }

    twig.renderFile('./views/socket/three_child.twig', {
        node: newParentNode,
        TypeEnum: NodeTypeEnum,
        sub_level: sub_level,
        breadcrumb: breadcrumb
    }, (err, html) => {
        if (err) {
            console.log(err);
            newParentNode.children.pop();
            newParentNode.save();
            newPart.remove();
            subNode.remove();
            return res.status(500).send('Intern Error');
        } else return res.send(html);
    });
}

var controllerPOST = {
    newPart: newPart
};

module.exports = controllerPOST;