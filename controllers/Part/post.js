const Part = require('../../models/Part');
const NodeSchema = require('../../models/Node');
const UserSchema = require('../../models/User');
const config = require('../../config/server');
const escape = require('escape-html');
const path = require('path');
const typeMime = require('../../utils/type-mime');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');
const createFile = require('../utils/createFile');
const create3DFile = require('../utils/create3DFile');
const twig = require('twig');
const Assembly = require('../../models/Assembly');
const createTextureFile = require('../utils/createTextureFile');
// const createArchive = require('../utils/createArchive');
const asyncForeach = require('../../utils/asyncForeach');
const log = require('../../utils/log');
const AppError = require('../../utils/error/customAppError');

function asyncTwigRenderFile(chemin, options) {
  return new Promise((resolve, reject) => {
    twig.renderFile(chemin, options, (err, html) => {
      if (err) reject(err);
      resolve(html);
    });
  });
}

function throwError(err) {
  throw err;
}

/**
 * Create a new Part for the specified node
 */
const newPart = async (req, res) => {
  const nodeId = escape(req.params.nodeId);
  const name = escape(req.body.name);
  const description = escape(req.body.description);

  let sub_level = Number(req.body.sub_level);
  const breadcrumb = escape(req.body.breadcrumb);

  const email = req.session.userMail;

  sub_level++;

  let creator;
  try {
    creator = await UserSchema.findOne({
      email,
    });
  } catch (err) {
    const message = err.message ? err.message : 'Error intern';
    const status = err.status ? err.status : '500';
    log.error(`[ Post Part Controller ] creator : ${message}  \n`, new Error(err));
    return res.status(status).send(message);
  }

  let parentNode;
  try {
    parentNode = await NodeSchema.findById(nodeId);

    if (!parentNode) throw new AppError('Not Found', 404);
    else if (parentNode.type !== NodeTypeEnum.assembly)
      throw new AppError(`The node is a ${parentNode.type}, it should be an ${NodeTypeEnum.assembly}`, 401);
  } catch (err) {
    const message = err.message ? err.message : 'Error intern';
    const status = err.status ? err.status : '500';
    log.error(`[ Post Part Controller ] - ${message} \n`, err);
    return res.status(status).send(message);
  }

  let parentAssembly;
  try {
    parentAssembly = await Assembly.findById(parentNode.content);
  } catch (err) {
    const message = "Couldn't find the parent Node";
    const status = 500;
    log.error(`[ Post Part Controller ] - ${message} \n`, err);
    return res.status(status).send(message);
  }

  let part;
  try {
    part = await Part.newDocument({
      name,
      description,
      ownerOrganization: parentAssembly.ownerOrganization,
      ParentAssemblies: [{
        _id: parentAssembly._id,
        name: parentAssembly.name,
      }],
      creator: {
        _id: creator._id,
        completeName: creator.completeName,
        email: creator.email,
      },
    });

    part = await part.save();
  } catch (err) {
    const message = 'Intern Error';
    const status = 500;
    await part.remove().catch(error => log.fatal(error));
    log.error('[ Post Part Controller ] - Cannot create the Part \n', new Error(err));
    return res.status(status).send(message);
  }

  let subNode;
  try {
    subNode = await NodeSchema.create({
      name,
      description,
      type: NodeTypeEnum.part,
      content: part._id,
      Workspaces: parentNode.Workspaces,
      team: parentNode.team,
    });

    subNode = await subNode.save();
  } catch (err) {
    const message = 'Intern Error';
    const status = 500;

    await part.remove().catch(error => log.fatal(error));
    await subNode.remove().catch(error => log.fatal(error));
    log.error('[ Post Part Controller ] - Cannot create the sub Node \n', new Error(err));
    return res.send(status).send(message);
  }

  parentNode.children.push({
    _id: subNode._id,
    type: subNode.type,
    name: subNode.name,
  });

  try {
    await parentNode.save();
  } catch (err) {
    const message = 'Intern Error';
    const status = 500;
    part.remove();
    subNode.remove();
    return res.status(status).send(message);
  }

  const options = {
    node: subNode,
    TypeEnum: NodeTypeEnum,
    sub_level,
    breadcrumb,
    sockets: [{
      message: 'Update File 3D',
      order: '[Viewer] - Update',
      dataToSend: [subNode._id],
    }],
  };

  const html = await asyncTwigRenderFile('./views/socket/three_list_child.twig', options).catch(error => throwError(error));
  return res.status(200).send({ partId: part._id, nodeId, html });

  // return res.status(200).send(part._id);
};

const addFileToPart = async (req, res) => {
  const partId = escape(req.params.partId);
  const nodeId = escape(req.params.nodeId);
  const type = escape(req.params.type);
  var { sentFile } = req.files;

  let part;
  try {
    part = await Part.findById(partId);
  } catch (err) {
    const message = err.message ? err.message : 'Error intern';
    const status = err.status ? err.status : '500';
    log.error(`[ Post File Controller ] part : ${message}  \n`, new Error(err));
    return res.status(status).send(message);
  }


  const sendError = [];
  // Create specification file.
  const chemin = path.join(config.files3D, part.path);

  if (type === 'specs') {
    try {
      await createFile(chemin, sentFile[0]);
    } catch (err) {
      sendError.push(`Could'nt import the file : ${sentFile[0].originalname}`);
      log.warn(err);
      return res.status(400).send({ nodeId, partId, sendError, name: sentFile[0].originalname  });
    }
  } else if (type === 'textures') {
    try {
      await createTextureFile(chemin, sentFile[0]);
    } catch (err) {
      sendError.push(`Could'nt import the file : ${sentFile[0].originalname}`);
      log.warn(err);
      return res.status(400).send({ nodeId, partId, sendError, name: sentFile[0].originalname });
    }
  } else if (type === 'files3d') {
    try {
      await create3DFile(chemin, sentFile[0]);
    } catch (err) {
      sendError.push(`Could'nt import the 3DFile : ${sentFile[0].originalname}`);
      log.warn(err);
      return res.status(400).send({ nodeId, partId, sendError, name: sentFile[0].originalname });
    }
  }

  sendError.forEach(err => log.error(err));
  return res.status(200).send({ nodeId, partId, sendError, name: sentFile[0].originalname });
};

// /**
//  * Create a new Part for the specified node
//  */
// const newPart = async (req, res) => {
//   const nodeId = escape(req.params.nodeId);
//   const name = escape(req.body.name);
//   const description = escape(req.body.description);
//   let sub_level = Number(req.body.sub_level);
//   const breadcrumb = escape(req.body.breadcrumb);
//   const {
//     specFiles,
//     file3D,
//     textureFiles,
//   } = req.files;
//   const email = req.session.userMail;
//
//   sub_level++;
//
//   let creator;
//   try {
//     creator = await UserSchema.findOne({
//       email
//     });
//   } catch (err) {
//     const message = err.message ? err.message : 'Error intern';
//     const status = err.status ? err.status : '500';
//     log.error(`[ Post Part Controller ] creator : ${message}  \n`, new Error(err));
//     return res.status(status).send(message);
//   }
//
//   let parentNode;
//   try {
//     parentNode = await NodeSchema.findById(nodeId);
//
//     if (!parentNode) throw new AppError('Not Found', 404);
//     else if (parentNode.type !== NodeTypeEnum.assembly)
//       throw new AppError(`The node is a ${parentNode.type}, it should be an ${NodeTypeEnum.assembly}`, 401);
//   } catch (err) {
//     const message = err.message ? err.message : 'Error intern';
//     const status = err.status ? err.status : '500';
//     log.error(`[ Post Part Controller ] - ${message} \n`, err);
//     return res.status(status).send(message);
//   }
//
//   let parentAssembly;
//   try {
//     parentAssembly = await Assembly.findById(parentNode.content);
//   } catch (err) {
//     const message = "Couldn't find the parent Node";
//     const status = 500;
//     log.error(`[ Post Part Controller ] - ${message} \n`, err);
//     return res.status(status).send(message);
//   }
//
//   let part;
//   try {
//     part = await Part.newDocument({
//       name,
//       description,
//       ownerOrganization: parentAssembly.ownerOrganization,
//       ParentAssemblies: [{
//         _id: parentAssembly._id,
//         name: parentAssembly.name,
//       }],
//       creator: {
//         _id: creator._id,
//         completeName: creator.completeName,
//         email: creator.email,
//       },
//     });
//
//     part = await part.save();
//   } catch (err) {
//     const message = 'Intern Error';
//     const status = 500;
//     await part.remove().catch(error => log.fatal(error));
//     log.error('[ Post Part Controller ] - Cannot create the Part \n', new Error(err));
//     return res.status(status).send(message);
//   }
//
//   let subNode;
//   try {
//     subNode = await NodeSchema.create({
//       name,
//       description,
//       type: NodeTypeEnum.part,
//       content: part._id,
//       Workspaces: parentNode.Workspaces,
//       team: parentNode.team,
//     });
//
//     subNode = await subNode.save();
//   } catch (err) {
//     const message = 'Intern Error';
//     const status = 500;
//
//     await part.remove().catch(error => log.fatal(error));
//     await subNode.remove().catch(error => log.fatal(error));
//     log.error('[ Post Part Controller ] - Cannot create the sub Node \n', new Error(err));
//     return res.send(status).send(message);
//   }
//
//   parentNode.children.push({
//     _id: subNode._id,
//     type: subNode.type,
//     name: subNode.name,
//   });
//
//   try {
//     await parentNode.save();
//   } catch (err) {
//     const message = 'Intern Error';
//     const status = 500;
//     part.remove();
//     subNode.remove();
//     return res.status(status).send(message);
//   }
//
//   const sendError = [];
//   // Create specification file.
//   const chemin = path.join(config.files3D, part.path);
//   if (specFiles) {
//     await asyncForeach(specFiles, async (spec) => {
//       try {
//         await typeMime(1, spec.mimetype);
//         await createFile(chemin, spec);
//       } catch (err) {
//         sendError.push(`Could'nt import the file : ${spec.originalname}`);
//         log.warn(err);
//       }
//     });
//   }
//
//   if (textureFiles) {
//     await asyncForeach(textureFiles, async (texture) => {
//       try {
//         await createTextureFile(chemin, texture);
//       } catch (err) {
//         sendError.push(`Could'nt import the file : ${texture.originalname}`);
//         log.warn(err);
//       }
//     });
//   }
//
//   if (file3D) {
//     await asyncForeach(file3D, async (file) => {
//       try {
//         await create3DFile(chemin, file);
//       } catch (err) {
//         sendError.push(`Could'nt import the 3DFile : ${file.originalname}`)
//         log.warn(err);
//       }
//     });
//   }
//
//   sendError.forEach(err => log.error(err));
//
//   const options = {
//     node: parentNode,
//     TypeEnum: NodeTypeEnum,
//     sub_level,
//     breadcrumb,
//     sockets: [{
//       message: 'Update File 3D',
//       order: '[Viewer] - Update',
//       dataToSend: [subNode._id],
//     }],
//   };
//
//   const html = await asyncTwigRenderFile('./views/socket/three_child.twig', options).catch(error => throwError(error));
//   return res.send(html);
// };


const controllerPOST = {
  newPart,
  addFileToPart,
};

module.exports = controllerPOST;
