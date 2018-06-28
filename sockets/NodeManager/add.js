const userSchema = require('../../models/User');
const workspaceSchema = require('../../models/Workspace');
/**
 * 
 * 
 * @param {any} io 
 * @param {any} socket 
 */
module.exports = (io, socket) => {
  /**
   * 
   * @param {Object} context
   * @param {string} context.workspaceId
   * @param {Object} context.node
   * @param {string} context.node.name
   * @param {parent} context.parent
   */
  socket.on('[NodeManager] - create Node',
    async ({ workspaceId, node, parent }) => {
      const { userId } = socket.handshake.session;
      try {
        let userHaveRights = checkAuthorization(workspaceId, userId);
      } catch(err) {
        socket.emit('error', "Cannot create the node - You don't have the rights");
        return log.error(err);
      }

      let nodeParent = await nodeSchema.findById(parent);
      let node = await nodeSchema.create({
         
      })
    })
};

const checkAuthorization = async (workspaceId, email) => {
  let workspace = await workspaceSchema.findById(workspaceId);
  if (!workspace) return console.log("Workspace Not Found");

  let rights = workspace.userRights(userId);
  return rights === 2 && rights === 3;
};
