const mv = require('mv');
const fsPart = require('../config/PartFileSystem');
const config = require('../config/server');
const Node = require('../models/Node');
const Workspace = require('../models/Workspace');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const path = require('path');
const NodeTypeEnum = require('../enum/NodeTypeEnum');

const appDir = path.dirname(require.main.filename);
const FSconfig = require('../config/FileSystemConfig');
const log = require('../utils/log');

/**
 * get the right uploadDir
 * @param fileName : { String }
 * @param nodeId : { String }
 * @param workspaceId : { String }
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
    ret = path.join(config.files3D, content.path, fsPart.spec);
  } catch (e) {
    throw e;
  }
  return ret;
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
    getUploadir(fileInfo.name, fileInfo.data.nodeId, socket.handshake.session.currentWorkspace)
      .then((ret) => {
        fileInfo.uploadDir = path.join(FSconfig.appDirectory.tmp, fileInfo.name);
        mv(fileInfo.uploadDir,
          path.join(ret, fileInfo.name),
          (err) => {
            if (err)
              log.error(err)
          });

        socket.emit('addSpec', fileInfo.name);
        fileInfo.uploadDir = ret;
        log.info('Upload Complete.');
        log.info(fileInfo);
      })
      .catch((err) => log.error('Error ! : ', err));
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
};
