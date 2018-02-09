const getPathToSpec = require('../utils/node/getPathToSpec');
const mv_not_promisify = require('mv');
const util = require('util');
const path = require('path');
const filenameRegex = require('../utils/regex').filename;

const listenerName = 'renameSpec';
const mv = util.promisify(mv_not_promisify);

async function renameSpecListener(nodeId, lastName, currentName, workspaceId) {
  if (!filenameRegex.test(lastName) || !filenameRegex.test(currentName)) throw Error('Invalid filename');
  const p = await getPathToSpec(nodeId, workspaceId);
  await mv(path.join(p, lastName), path.join(p, currentName));
}

module.exports = (io, socket) => {
  socket.on(listenerName, ({ nodeId, lastName, currentName }) => {
    console.log(`${listenerName}: `, nodeId, lastName, currentName);
    renameSpecListener(nodeId, lastName, currentName, socket.handshake.session.currentWorkspace)
      .then(() => {
        io.to(socket.handshake.session.currentWorkspace)
          .emit(listenerName, { nodeId, lastName, currentName });
      })
      .catch((err) => {
        // Todo: Make an error emiter
        console.log(err);
      });
  });
};

