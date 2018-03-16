const partSchema = require('../../models/Part');
const nodeSchema = require('../../models/Node');
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');
const create3DFile = require('../utils/create3DFile');
const createTextureFile = require('../utils/createTextureFile');
const asyncForeach = require('../utils/asyncForeach');
const log = require('../../utils/log');
const fs = require('fs');
const util = require('util');
const partFileSystem = require('../../config/PartFileSystem');
const AppError = require('../../utils/error/customAppError');

// const Assembly = require('../../models/Assembly');
// const twig = require('twig');
// const userSchema = require('../../models/User');
// const createArchive = require('../utils/createArchive');
// const doesHeHaveRights = require('../utils/doesHeHaveRights');
// const mimeType = require('../../utils/type-mime');


const deleteFiles = util.promisify(fs.unlink);

const readDir = util.promisify(fs.readdir);

async function deleteDirFiles(chemin) {
  const dirDelete = path.join(chemin, partFileSystem.data);
  const dirContent = await readDir(dirDelete).catch((err) => {
    throw err;
  });

  await asyncForeach(dirContent, async (file) => {
    await deleteFiles(path.join(chemin, file)).catch((err) => {
      throw err;
    });
  });
  return null;
}

/**
 * Create a new Part for the specified node
 */
const updatePart = async (req, res) => {
  const nodeId = escape(req.params.nodeId);
  const name = escape(req.body.name);
  const description = escape(req.body.description);
  const {
    file3D,
    textureFiles,
  } = req.files;

  const node =
    await nodeSchema.findById(nodeId).catch((err) => {
      log.warn(err);
      return res.status(500).send('Intern Error');
    });

  if (!node) return res.status(404).send('Not Found');

  log.info(node.type);

  if (node.type !== NodeTypeEnum.part) return res.status('401').send('Not a Part');

  const parentNode =
    await nodeSchema.findOne({
      children: {
        $in: [{
          _id: nodeId,
          type: NodeTypeEnum.assembly,
          name: node.name,
        }],
      },
    });

  let part;
  try {
    part = await partSchema.findById(node.content);

    if (!part) throw new AppError('Part Not Found', 404);

    part.name = name || part.name;
    part.description = description || part.description;

    await part.save().catch((err) => {
      log.error(err);
      throw new AppError('Cannot save the modification', 500);
    });
  } catch (err) {
    const message = err.message ? err.message : 'Intern Error';
    const status = err.status ? err.status : 500;
    log.error('[ Put Part Controller ] - Cannot Save the modification \n', err);
    return res.status(status).send(message);
  }

  const sendError = [];
  const chemin = path.join(config.files3D, part.path);

  if (textureFiles) {
    await asyncForeach(textureFiles, async (texture) => {
      try {
        await deleteDirFiles(chemin);
        await createTextureFile(chemin, texture);
      } catch (err) {
        sendError.push(`Could'nt import the file : ${texture.originalname}`);
        log.warn(err);
      }
    });
  }

  if (file3D) {
    await asyncForeach(file3D, async (file) => {
      await create3DFile(chemin, file)
        .catch((err) => {
          sendError.push(`Could'nt import the file : ${file.originalname}`);
          log.warn(err);
        });
    });
  }

  sendError.forEach((err) => {
    log.error(err);
  });
  return res.send(name);
};

const controllerPOST = {
  updatePart,
};

module.exports = controllerPOST;