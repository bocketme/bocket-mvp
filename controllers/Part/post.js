const Part = require("../../models/Part");
const NodeSchema = require("../../models/Node");
const UserSchema = require("../../models/User");
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
const asyncForeach = require('../utils/asyncForeach');
const log = require('../../utils/log');
/**
* Create a new Part for the specified node
*/
const newPart = async (req, res) => {
    
    let nodeId = escape(req.params.nodeId),
    name = escape(req.body.name),
    description = escape(req.body.description),
    sub_level = Number(req.body.sub_level),
    breadcrumb = escape(req.body.breadcrumb),
    specFiles = req.files['specFiles'],
    files_3d = req.files['file3D'];
    
    sub_level++;
    
    userEmail = req.session.userMail;
    let creator;
    try {
        creator = await UserSchema.findOne({ email: userEmail });
    } catch (err) {
        let message = err.message ? err.message : "Error intern";
        let status = err.status ? err.status : "500";
        log.error("[ Post Part Controller ] creator  :" + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }
    
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
        log.error("[ Post Part Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message);
    }
    
    let parentAssembly;
    try {
        parentAssembly = await Assembly.findById(parentNode.content);
    } catch (err) {
        message = err.message ? err.message : "Error intern";
        status = err.status ? err.status : 500;
        log.error("[ Post Part Controller ] " + message + "\n" + new Error(err));
        return res.status(status).send(message); 
    }
    
    
    let part;
    try {
        part = Part.newDocument({
            name: name,
            description: description,
            ownerOrganization: parentAssembly.ownerOrganization,
            ParentAssemblies: [
                {
                    _id: parentAssembly._id,
                    name: parentAssembly.name
                }
            ],
            creator: {
                _id: creator._id,
                completeName: creator.completeName,
                email: creator.email
            },
        });
        
        part = await part.save();
    } catch (err) {
        message = 'Intern Error';
        status = 500;
        if (part)
        part.remove();
        log.error("[ Post Part Controller ] \n" + new Error(err))
    }
    
    let subNode;
    try {
        subNode = NodeSchema.newDocument({
            name: name,
            description: description,
            type: NodeTypeEnum.part,
            content: part._id,
            Workspaces: parentNode.Workspaces,
            team: parentNode.team,
        });
        
        subNode = await subNode.save();
    } catch (err) {
        message = 'Intern Error';
        status = 500;
        if (part)
        part.remove();
        subNode.remove();
        log.error("[ Post Part Controller ] \n" + new Error(err));
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
        message = "Intern Error";
        status = 500;
        return res.status(status).send(message); 
    }
    
    let sendError = [];
    let chemin = path.join(config.files3D, part.path);
    if (specFiles) {
        asyncForeach(specFiles, async function (spec, i, specFiles) {
            try {
                await type_mime(1, spec.mimetype);
                await createFile(chemin, spec);
            } catch (err) {
                sendError.push("Could'nt import the file : " + spec.originalname);
                log.error(err);
            }
        });
    }
    
    if (files_3d) {
        asyncForeach(files_3d, async function (file, i, files_3d) {
            try {
                await create3DFile(chemin, file);
            } catch (err) {
                sendError.push("Could'nt import the file : " + file.originalname);
                log.error(err);
            }
        });
    }
    
    sendError.forEach(err => {
        log.error(err);
    });
    
    twig.renderFile('./views/socket/three_child.twig', {
        node: newParentNode,
        TypeEnum: NodeTypeEnum,
        sub_level: sub_level,
        breadcrumb: breadcrumb
    }, (err, html) => {
        if (err) {
            log.error(err);
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