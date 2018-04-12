const getContentOfNode = require('../utils/node/getContentOfNode');
const Organization = require('../models/Organization');
const fs = require('fs');
const path = require('path');
const fsPart = require('../config/PartFileSystem');
const config = require('../config/server');

const appDir = path.dirname(require.main.filename);

async function getAllSpec(socket, nodeId, workspaceId) {
  try {
    const { content } = await getContentOfNode(nodeId);

    const organization =
        await Organization.findOne({ workspaces: { $elemMatch: { _id: workspaceId } } });
    if (organization == null) throw Error('unknown organization');

    const targetDirectoryName = `${content.name} - ${content._id}`;
    fs.readdir(`${config.files3D}/${organization.name}-${organization._id}/${content.name} - ${content._id}/${fsPart.spec}`, (fileError, files) => {
      console.log(fileError);
      if (!fileError) {
        files.forEach((fileName) => {
          console.log('filename:', fileName);
          socket.emit('addSpec', fileName);
        });
      }
    });

    // console.log('[getAllSpec] ORGANIZATION NAME : ', organization.name);
  } catch (e) {
    throw e;
  }
}

module.exports = (socket) => {
  socket.on('getAllSpec', (nodeId) => {
    console.log('getAllSpecListener');
    getAllSpec(socket, nodeId, socket.handshake.session.currentWorkspace)
      .then(() => { })
      .catch(err => console.log(err)); // TODO: emit socket error
  });
};
