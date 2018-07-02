const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Workspace] - remove', async (workspaceId, userId) => {
    try {
      console.log(workspaceId)

      const currentUser = await userSchema.findById(socket.handshake.session.userId);
      if (!currentUser) throw new Error('[Workspace] - cannot find the user')

      const workspace = await workspaceSchema.findById(workspaceId);
      if (!workspace) throw new Error('[Workspace] - cannot find the workspace')

      const organization = await organizationSchema.findById(workspace.Organization);
      if (!organization) throw new Error('[Workspace] - cannot find the organization');

      const rights = organization.userRights(currentUser._id);

      if (organization.isOwner(currentUser._id) ||
        organization.isAdmin(currentUser._id) ||
        workspace.isProductManager(currentUser._id) ||
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
          log.error(err);
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
      log.error(new Error(error));
      socket.emit('[Workspace] - remove', 'Intern Error - Cannot remove the user');
    }
  });
};
