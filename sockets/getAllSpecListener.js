const getContentOfNode = require('../utils/node/getContentOfNode');
const Organization = require('../models/Organization');
const fs = require('fs');
const path = require('path');

const appDir = path.dirname(require.main.filename);

async function getAllSpec(socket, nodeId, workspaceId) {
  try {
    const { content } = await getContentOfNode(nodeId);

    console.log(workspaceId);
    const organization =
        await Organization.findOne({ workspaces: { $elemMatch: { _id: workspaceId } } });
    if (organization == null) throw Error('unknown organization');

    const targetDirectoryName = `${content.name} - ${content._id}`;
    fs.readdir(`${appDir}/data/files3D/${organization.name}`, (dirError, directories) => {
      if (!dirError) {
        console.log(targetDirectoryName);
        directories.forEach((name) => {
          console.log('dirname:', name, targetDirectoryName, name === targetDirectoryName);
          if (name === targetDirectoryName) {
            fs.readdir(`${appDir}/data/files3D/${organization.name}/${name}/import`, (fileError, files) => {
              if (!fileError) {
                files.forEach((fileName) => {
                  console.log('filename:', fileName);
                  socket.emit('addSpec', fileName);
                });
              }
            });
          }
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
