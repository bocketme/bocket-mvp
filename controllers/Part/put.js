const partSchema = require("../../models/Part");
const nodeSchema = require("../../models/Node");
const userSchema = require("../../models/User");
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
const fs = require('fs');
const util = require('util');
const partFileSystem = require("../../config/PartFileSystem");

/**
 * Check if the user can delete the node
 * @param userMail {string}
 * @param nodeId {string}
 * @return {Promise<void>}
 */
async function doesHeHaveRights(userMail, nodeId) {
    const user = await userSchema.find({'email': userMail}).catch(err => log.error(new Error(err)));

    if (!user) return null;

    const query = nodeSchema.findById(nodeId).or([{'team.members': user._id, 'team.owners': user._id}]);
    const node = await query.exec().catch(err => log.error(new Error(err)));

    if (!node) return null;
    else return node;
}


/**
* Create a new Part for the specified node
*/
const updatePart = async (req, res) => {
    
    let nodeId = escape(req.params.nodeId),
    name = escape(req.body.name),
    description = escape(req.body.description),
    files_3d = req.files['file3D'];
    
    const node =
        await nodeSchema.findById(nodeId).catch(err => {return res.status(500).send("Intern Error")});

    if (!node)
        return res.status(404).send('Not Found');

    log.info(node.type);

    if (node.type !== NodeTypeEnum.part)
        return res.status('401').send('Not a Part');

    const parentNode =
        await nodeSchema.findOne({ children: { $in: [{ _id: nodeId, type: NodeTypeEnum.assembly, name: node.name }] } });
    
    let part;
    try {
        part = await partSchema.findById(node.content);
        
        if(!part) throw {message: 'Not Found', status: '404', error: new Error('Part Not Found')}

        part.name = name? name : part.name;
        part.description = description? description: part.description;

        await part.save();
    } catch (err) {
        let message =  err.message ? err.message : 'Intern Error';
        let status = err.status ? err.status : 500;
        let error = err.error ? err.error : err
        log.error("[ Put Part Controller ] \n" + new Error(error))
        return res.status(status).send(message)
    }
        
    let sendError = [];
    log.info(part.path)
    let chemin = path.join(config.files3D, part.path);
    
    if (files_3d) {
        for(let file in files_3d) {
            await deleteDirFiles(chemin);
            await create3DFile(chemin, files_3d[file])
            .catch(err => {
                sendError.push("Could'nt import the file : " + file.originalname);
                log.error(err);
            })
        }
    }
    
    sendError.forEach(err => { log.error(err); });
    res.send(name);
}

var controllerPOST = { updatePart };

module.exports = controllerPOST;

const deleteFiles = util.promisify(fs.unlink); 

const readDir = util.promisify(fs.readdir);

const deleteDirFiles = async (chemin) => {

    chemin = path.join(chemin, partFileSystem.data)

    let dir = await readDir(chemin).catch(err => {throw err});

    for (let file in dir) {
        await deleteFiles(path.join(chemin, dir[file])).catch(err => {throw err});
    }

    return;
}