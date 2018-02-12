const path = require('path'),
    escape = require('escape-html'),
    config = require('../../config/server'),
    type_mime = require('../../utils/type-mime'),
    NodeTypeEnum = require('../../enum/NodeTypeEnum'),
    createFile = require('../utils/createFile'),
    create3DFile = require('../utils/create3DFile'),
    twig = require('twig'),
    pino = require('pino')();

const nodeSchema = require("../../models/Node");
const assemblySchema = require('../../models/Assembly');
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
        sub_level = Number(req.body.sub_level),
        breadcrumb = escape(req.body.breadcrumb),
        specFiles = req.files['specFiles'];

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
        pino.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }

    let parentAssembly;
    try {
        parentAssembly = await assemblySchema.findById(parentNode.content);
    } catch (err) {
        let message = err.message ? err.message : "Error intern";
        let status = err.status ? err.status : 500;
        pino.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }

    let assembly;
    try {
        assembly = await assemblySchema.create({
        name: name,
        description: description,
        tags: tags,
            ownerOrganization: parentAssembly.ownerOrganization,
        });

        await assembly.save();
    } catch (err) {
        pino.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
       if (assembly)
           assembly.remove();
        return res.status(500).send("Error Intern");
    }

    let subNode;
    try {
        subNode = await nodeSchema.create({
            name: name,
            description: description,
            type: NodeTypeEnum.assembly,
            content: assembly._id,
            Workspaces: parentNode.Workspaces,
            tags: tags,
            team: parentNode.team,
        });

        await subNode.save();
    } catch (err) {
        pino.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
        if (assembly)
            assembly.remove();
        if (subNode)
            subNode.remove();
        return res.status(500).send("Error Intern");
    }

    parentNode.children.push({
        _id: subNode._id,
        type: subNode.type,
        name: subNode.name,
    });
    try {
        await parentNode.save()
    } catch (err) {
        if (assembly)
            assembly.remove();
        if (subNode)
            subNode.remove();
    }

    //TODO: Affichage d'erreur specFiles
    let chemin = path.join(config.files3D, assembly.path);
    if (specFiles) {
        asyncForeach(specFiles, async function (spec) {
            try {
                await type_mime(1, spec.mimetype);
                await createFile(chemin, spec);
            } catch (err) {
                pino.error("[ Post Assembly Controller ] \n" + new Error(err));
            }
        });
    }

    twig.renderFile('./views/socket/three_child.twig', {
        node: parentNode,
        TypeEnum: NodeTypeEnum,
        sub_level: sub_level,
        breadcrumb: breadcrumb
    }, (err, html) => {
        if (err) {
            pino.error("[ Post Assembly Controller ] \n" + new Error(err));
            parentNode.children.pop();
            parentNode.save();
            assembly.remove();
            subNode.remove();
            return res.status(500).send('Intern Error');
        }
        console.log(html);
        return res.send(html);
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