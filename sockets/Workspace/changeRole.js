const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Workspace] - changeRoles', async (workspaceId, userAffected, newRole) => {
    try {
      const userId = socket.handshake.session.userId;
      const workspace = await workspaceSchema.findById(workspaceId);
      const organization = await organizationSchema.findOne({ 'Workspaces': workspaceId });

      const rights = organization.userRights(userId);

      if (organization.isOwner(userId) || organization.isAdmin(userId))
        await workspace.changeRole(userAffected, newRole);
      else throw new Error('You have no rights');

      await workspace
        .populate({ path: 'ProductManagers', select: 'completeName' })
        .populate({ path: 'Teammates', select: 'completeName' })
        .populate({ path: 'Observers', select: 'completeName' })
        .execPopulate();

      const ProductManagers = workspace.get('ProductManagers'),
        _id = workspace.get('_id'),
        Teammates = workspace.get('Teammates'),
        Observers = workspace.get('Observers');

      twig.renderFile('./views/organizationSettings/workspaceUserList.twig', {
        workspace: { _id, ProductManagers, Teammates, Observers, isProductManager: workspace.isProductManager(userId) },
        currentUser: { rights }
      }, function (err, html) {
        if (err) {
          log.error(err);
          return socket.emit('[Workspace] - changeRoles', 'Please recharge the page');
        } else return socket.emit('[Workspace] - changeRoles', null, html, workspaceId);
      })
    } catch (err) {
      log.error(err);
      return socket.emit('[Workspace] - changeRoles', 'Cannot change the role');
    }
  });
};
