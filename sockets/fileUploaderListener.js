const mv = require('mv');
const Node = require('../models/Node');

module.exports = (socket, uploader) => {
  uploader.on('start', (fileInfo) => {
    console.log('Start uploading');
    console.log(fileInfo);
  });
  uploader.on('stream', (fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
  });
  uploader.on('complete', (fileInfo) => {
    console.log('Upload Complete.');
    console.log(fileInfo);
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
};

/**
 * get the right uploadDir
 * @param nodeId : { String }
 * @return {Promise<String>}
 */
/*async function getUploadir(nodeId) {
  try {
    await
  } catch (e) {
    throw e;
  }
  return '';
}*/
