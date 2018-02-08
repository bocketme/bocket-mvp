const mv = require('mv');
const Node = require('../models/Node');
const Workspace = require('../models/Workspace');
const Part = require('../models/Part');
const Assembly = require('../models/Assembly');
const path = require('path');
const NodeTypeEnum = require('../enum/NodeTypeEnum');

const appDir = path.dirname(require.main.filename);

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
    if (!node || !workspace) throw Error('Unknown node');
    if (node.type === NodeTypeEnum.part) {
      content = await Part.findById(node.content);
    } else if (node.type === NodeTypeEnum.part) {
      content = await Assembly.findById(node.content);
    }
    if (!content) throw Error('Unknown content');
    ret = `${appDir}/data/files3D/${workspace.organization.name}/${content.name} - ${node.content}/import/${fileName}`;
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
        mv(`${appDir}/${fileInfo.uploadDir}`, ret, () => {});
        fileInfo.uploadDir = ret;
        console.log('Upload Complete.');
        console.log(fileInfo);
      })
      .catch((err) => {
        console.log('Error!', err);
      });
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
};
