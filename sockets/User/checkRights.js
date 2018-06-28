const userSchema = require('../../models/User');
const log = require('../../utils/log');

module.exports = (io, socket) => {

  async function checkRights(orgnanizationId, workspaceId) {
    try {
      if((!organizationId && !workspaceId)||(organizationId && workspaceId))
      throw new Error('[User] - check rights : Problems with the var send');        
    } catch (err) {
      log.error(err) 
    }
  }

  socket.on('[User] - Check Rights', checkRights);
}
