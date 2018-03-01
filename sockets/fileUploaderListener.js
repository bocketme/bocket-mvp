const mv = require('mv');
const fsPart = require('../config/PartFileSystem');
const config = require('../config/server');
const Node = require('../models/Node');
const Workspace = require('../models/Workspace');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const path = require('path');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const getNodeDataDirectory = require('../utils/node/getNodeDataDirectory');
const cleanDirectory = require('../utils/cleanDirectory/app');
const PartFileSytemConfig = require('../config/PartFileSystem');
const succeededEmitter = require('../sockets/emitter/actionSucceeded');
const failedEmitter = require('../sockets/emitter/actionFailed');

const appDir = path.dirname(require.main.filename);

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
    if (!node || !workspace) throw Error('Unknown node');
    if (node.type === NodeTypeEnum.part) {
      content = await Part.findById(node.content);
    } else if (node.type === NodeTypeEnum.part) {
      content = await Assembly.findById(node.content);
    }
    if (!content) throw Error('Unknown content');
    ret = `${config.files3D}/${workspace.organization.name}-${workspace.organization._id}/${content.name} - ${node.content}/${fsPart.spec}/${fileName}`;
  } catch (e) {
    throw e;
  }
  return ret;
}

async function edit3DFile(fileInfo, data, workspaceId) {
  const { nodeId } = data;

  let p = await getNodeDataDirectory(nodeId, workspaceId);
  p = path.join(p, PartFileSytemConfig.data);
  cleanDirectory(p, () => { });
  p = path.join(p, fileInfo.name);
  mv(fileInfo.uploadDir, p, console.log);
}

module.exports = (socket, uploader) => {
  uploader.on('start', (fileInfo) => {
    console.log('Start uploading');
    console.log(fileInfo);
  });
  uploader.on('stream', (fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
  });
  uploader.on('complete', (fileInfo) => {
    if (Object.prototype.hasOwnProperty.call(fileInfo.data, 'editPart')) { // Edit 3D file
      edit3DFile(fileInfo, fileInfo.data, socket.handshake.session.currentWorkspace)
        .then(() => succeededEmitter(socket, { title: 'Edit part', description: '3D file upload succeeded' }))
        .catch(() => failedEmitter(socket, { title: 'Edit part', description: '3D file upload failed' }));
    } else { // Upload specs
      getUploadir(fileInfo.name, fileInfo.data.nodeId, socket.handshake.session.currentWorkspace)
        .then((ret) => {
          mv(`${appDir}/${fileInfo.uploadDir}`, ret, () => {});
          socket.emit('addSpec', fileInfo.name);
          fileInfo.uploadDir = ret;
          console.log('Upload Complete.');
        })
        .catch((err) => {
          console.log('Error!', err);
        });
    }
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
};
