const getPathToSpec = require('../utils/node/getPathToSpec');
const util = require('util');
const fs = require('fs');
const path = require('path');
const filenameRegex = require('../utils/regex').filename;

const listenerName = 'removeSpec';

const unlink = util.promisify(fs.unlink);

async function removeSpecListener(nodeId, filename, session) {
  console.log(filename);
  if (!filenameRegex.test(filename)) throw Error('Invalid filename');

  const p = await getPathToSpec(nodeId, session.currentWorkspace);
  const ret = await unlink(path.join(p, filename));
  return !(ret);
}

module.exports = (io, socket) => {
  socket.on(listenerName, ({ nodeId, filename }) => {
    console.log(listenerName, nodeId, filename);
    removeSpecListener(nodeId, filename, socket.handshake.session)
      .then((ret) => {
        if (ret) {
          io.to(socket.handshake.session.currentWorkspace).emit(listenerName, { nodeId, filename });
        }
      })
      .catch((err) => {
        // TODO: make an error emitter;
        console.log(err);
      });
  });
};
