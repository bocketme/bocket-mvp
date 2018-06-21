const mv = require('mv');
const fsPart = require('../config/PartFileSystem');
const config = require('../config/server');
const Node = require('../models/Node');
const Workspace = require('../models/Workspace');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const path = require('path');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const getContentOfNode = require('../utils/node/getContentOfNode');
const cleanDirectory = require('../utils/cleanDirectory/app');
const PartFileSytemConfig = require('../config/PartFileSystem');
const succeededEmitter = require('../sockets/emitter/actionSucceeded');
const failedEmitter = require('../sockets/emitter/actionFailed');

const appDir = path.dirname(require.main.filename);
const FSconfig = require('../config/FileSystemConfig');
const log = require('../utils/log');

/**
 * get the right uploadDir
 * @param fileName : {String}
 * @param nodeId : {String}
 * @param workspaceId : {String}
 * @return {Promise<String>}
 */
async function getUploadir(fileName, nodeId, workspaceId) {
  let ret = '';
  let content = '';
  try {
    const node = await Node.findById(nodeId);
    const workspace = await Workspace.findById(workspaceId);
    if (!node || !workspace) throw new Error('Unknown node');
    if (node.type === NodeTypeEnum.part)
      content = await Part.findById(node.content);
    else if (node.type === NodeTypeEnum.assembly)
      content = await Assembly.findById(node.content);
    if (!content) throw new Error('Unknown content');
    ret = path.join(config.files3D, content.path, fsPart.spec, fileName);
  } catch (e) {
    throw e;
  }
  return ret;
}

async function edit3DFile(fileInfo, data, workspaceId) {
  const { nodeId } = data;
  const { content, type } = await getContentOfNode(nodeId);
  if (!content) { throw Error(''); }

  if (type === NodeTypeEnum.part) {
    let p = path.join(config.files3D, content.path, PartFileSytemConfig.data);
    cleanDirectory(p, () => { });
    p = path.join(p, fileInfo.name);
    mv(fileInfo.uploadDir, p, log.info);
  }
}

module.exports = (socket, uploader) => {
  let uploadDir = null;
  uploader.on('start', (fileInfo) => {
    log.info('Start uploading');
    uploadDir = fileInfo.uploadDir;
  });
  uploader.on('stream', (fileInfo) => {
    log.info(`${Math.trunc(fileInfo.wrote/fileInfo.size*100)}% uploaded`);
  });
  uploader.on('complete', (fileInfo) => {
    if (Object.prototype.hasOwnProperty.call(fileInfo.data, 'editPart')) { // Edit 3D file
      edit3DFile(fileInfo, fileInfo.data, socket.handshake.session.currentWorkspace)
        .then(() => succeededEmitter(socket, { title: 'Edit part', description: '3D file upload succeeded' }))
        .catch(() => failedEmitter(socket, { title: 'Edit part', description: '3D file upload failed' }));
    } else { // Upload specs
      getUploadir(fileInfo.name, fileInfo.data.nodeId, socket.handshake.session.currentWorkspace)
        .then((ret) => {
          if (!uploadDir) return Promise.reject(new Error('Upload not found !'));
          log.info(uploadDir, ret);
          mv(uploadDir, ret, (err) => { if(err) log.error(err); });
          socket.emit('addSpec', fileInfo.name);
          fileInfo.uploadDir = ret;
        })
        .catch((err) => { log.error(err); });
    }
  });
  uploader.on('error', (err) => { log.error(err); });
  uploader.on('abort', (fileInfo) => { console.log('Aborted: ', fileInfo); });
};
