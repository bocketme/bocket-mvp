const path = require('path'),
  escape = require('escape-html'),
  config = require('../../config/server'),
  type_mime = require('../../utils/type-mime'),
  NodeTypeEnum = require('../../enum/NodeTypeEnum'),
  createFile = require('../utils/createFile'),
  twig = require('twig'),
  UserSchema = require('../../models/User');


const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout);
const log = pino({
  name: 'app',
  safe: true
}, pretty);

const nodeSchema = require("../../models/Node");
const assemblySchema = require('../../models/Assembly');
const asyncForeach = require('../../utils/asyncForeach');

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
const newAssembly = async (req, res) => {



  let nodeId = escape(req.params.nodeId),
    name = escape(req.body.name),
    description = escape(req.body.description),
    sub_level = Number(req.body.sub_level),
    breadcrumb = escape(req.body.breadcrumb),
    specFiles = req.files['specFiles'];

  sub_level++;

  userEmail = req.session.userMail;
  let creator;
  try {
    creator = await UserSchema.findOne({ email: userEmail });
  } catch (err) {
    log.error("[ Post Part Controller ] creator  :" + (err.message || "Error intern") + "\n" + new Error(err));
    return res.status(err.status || "500").send(err.message || "Error intern");
  }

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
    log.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
    return res.status(status).send(message);
  }

  let parentAssembly;
  try {
    parentAssembly = await assemblySchema.findById(parentNode.content);
  } catch (err) {
    let message = err.message ? err.message : "Error intern";
    let status = err.status ? err.status : 500;
    log.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
    return res.status(status).send(message);
  }

  let assembly;
  try {
    assembly = await assemblySchema.create({
      name: name,
      Creator: creator._id,
      description: description,
      Organization: parentAssembly.Organization
    });

    await assembly.save();
  } catch (err) {
    let message = "Error intern";
    let status = "500";
    log.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
    if (assembly)
      assembly.remove();
    return res.status(status).send(message);
  }

  let subNode;
  try {
    subNode = await nodeSchema.create({
      name: name,
      description: description,
      type: NodeTypeEnum.assembly,
      content: assembly._id,
      Workspace: parentNode.Workspace,
      team: parentNode.team,
    });

    await subNode.save();
  } catch (err) {
    log.error("[ Post Assembly Controller ] " + message + "\n" + new Error(err));
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

  let fileNotcreated = [];

  //TODO: Affichage d'erreur specFiles
  let chemin = path.join(config.files3D, assembly.path);
  if (specFiles) {
    for (let specFile in specFiles) {
      try {
        await type_mime(1, specFiles[specFile].type_mime);
        console.log(specFiles[specFile]);
        await createFile(chemin, specFiles[specFile]);
      }
      catch (err) {
        fileNotcreated.push(specFiles[specFile].originalName);
        log.error("[ Post Assembly Controller ] \n" + new Error(err));
      }
    }
  }

  twig.renderFile('./views/socket/three_child.twig', {
    node: parentNode,
    TypeEnum: NodeTypeEnum,
    sub_level: sub_level,
    breadcrumb: breadcrumb,
    sockets:[{
      message: 'Update File 3D',
      order: '[Viewer] - Update',
      dataToSend: [subNode._id],
    }]
  }, (err, html) => {
    if (err) {
      log.error("[ Post Assembly Controller ] \n" + new Error(err));
      return res.status(500).send('Intern Error');
    }
    return res.send(html);
  });
};


/*****************************/
/*                           */
/*                           */
/*           Modules         */
/*                           */
/*                           */
/*****************************/


const controllerPOST = {
  newAssembly: newAssembly
};

module.exports = controllerPOST;
