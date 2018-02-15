const path = require('path'),
    escapre = require('escape-html'),
    config = require('../../config/server'),
    type_mime = require('../../utils/type-mime'),
    NodeTypeEnum = require('../../enum/NodeTypeEnum'),
    createFile = require('../utils/createFile'),
    create3DFile = require('../utils/create3DFile'),
    twig = require('twig');

const nodeSchema = require("../../models/Node");
const assemblySchema = require('../../models/Assembly');
const createArchive = require('../utils/createArchive');
const asyncForeach = require('../utils/asyncForeach');

/********************************************************/
/*                                                      */
/*                                                      */
/*                     Controllers                      */
/*                                                      */
/*                                                      */
/********************************************************/
/*                                                      */

/**
 * Create a new Part for the specified node
 */
const newAssembly = async  (req, res) => {

    let nodeId = escape(req.params.nodeId),
        name = escape(req.body.name),
        description = escape(req.body.description),
        tags = escape(req.body.tags),
        sub_level = escape(req.body.sub_level) + 1,
        breadcrumb =    escape(req.body.breadcrumb),
        specFiles = req.files['specFiles'],
        files_3d = req.files['file3D'],
        sendError = [];

    sub_level++;

    let parentNode;
    try {
        parentNode = await nodeSchema.findById(nodeId);

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

    let parentAssembly
    try {
        parentAssembly = await assemblySchema.findById(parentNode.content);
    } catch (err) {
        let message = err.message ? err.message : "Error intern";
        let status = err.status ? err.status : 500;
        console.error("[ Post Part Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }


    let assembly;
    try {
        assembly = assemblySchema.create({
        name: name,
        description: description,
        tags: tags,
            ownerOrganization: parentAssembly.ownerOrganization,
        });

        assembly = await assembly.save();
    } catch (err) {
       if (assembly)
           assembly.remove();
        console.error("[ Post Part Controller ] \n" + new Error(err));
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
        if (part)
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

    let chemin = path.join(config.files3D, part.path);
    if (specFiles) {
        asyncForeach(specFiles, async function (spec) {
            try {
                await type_mime(1, spec.mimetype);
                await createFile(chemin, spec);
            } catch (err) {
                return new Error("Could'nt import the file : " + spec.originalname);
                console.log(err);
            }
        });
    }

    /*
    if (files_3d) {
        asyncForeach(files_3d, async function (file, i, files_3d) {
            try {
                await create3DFile(chemin, file);
            } catch (err) {
                sendError.push("Could'nt import the file : " + file.originalname);
                console.log(err);
            }});
    }
    */

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
            assembly.remove();
            subNode.remove();
            return res.status(500).send('Intern Error');
        } else return res.send(html);
    });
};


/*****************************/
/*                                                      */
/*                                                      */
/*                      Modules                */
/*                                                      */
/*                                                      */
/*****************************/


var controllerPOST = {
    newAssembly: newAssembly
};

module.exports = controllerPOST;