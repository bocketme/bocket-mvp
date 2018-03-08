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
    
    
    let part;
    try {
        part = Part.findById();
        
        part = await part.save();
    } catch (err) {
        message = 'Intern Error';
        status = 500;
        if (part)
        part.remove();
        log.error("[ Post Part Controller ] \n" + new Error(err))
    }
    
    let node;
    try {
        node = NodeSchema.newDocument({
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
    
    try {
      let parentNode = NodeSchema.findById();

      parentNode.children

      await parentNode.save();
    } catch (err) {

    }
    
    let sendError = [];
    
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
        breadcrumb: breadcrumb,
        sockets: [{
            message: 'Update File 3D',
            order: "[Viewer] - Update",
            dataToSend: [subNode._id],
        }]
    }, (err, html) => {
        res.send(html);
    });
}

var controllerPOST = {
  newPart: newPart
};

module.exports = controllerPOST;