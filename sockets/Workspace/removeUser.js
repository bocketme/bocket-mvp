const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Workspace] - remove user', async (workspaceId, userId) => {
    try {
      const currentUser = socket.handshake.session.userId
      const workspace = await workspaceSchema.findById(workspaceId);
      const organization = await organizationSchema.findById(workspace.Organization);

      const rights = organization.userRights(currentUser);

      if (organization.isOwner(currentUser) ||
        organization.isAdmin(currentUser) ||
        workspace.isProductManager(currentUser) ||
        currentUser._id.equals(userId))
        await workspace.removeUser(userId, false);
      else return socket.emit('[Workspace] - remove', 'You have no right for this workspace');

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
          log.error(err)
          return socket.emit('[Workspace] - remove', 'Please recharge the page');
        } return socket.emit('[Workspace] - remove', null, html, workspaceId);
      });

      const user = await userSchema
        .findById(userId)
        .populate('Manager.Organization Manager.Workspaces')
        .exec();

      twig.renderFile('./socket/OrganizationNonAccess.twig', {
        title: "You no longer belong to this workspace",
        Manager: user.Manager
      }, function (err, html) {
        if (err)
          log.error(err);
        else
          return io.to(workspace._id).emit('[User] - Not Access', userId, html);
      });

    } catch (error) {
      console.error(error);
      socket.emit('[Workspace] - remove', 'Intern Error - Cannot remove the user');
    }
  });
}
