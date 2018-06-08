const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const twig = require('twig');

module.exports = (io, socket) => {
  socket.on('[Workspace] - remove', async (workspaceId, userId) => {
    try {
      const currentUser = socket.handshake.session.userId
      const workspace = await workspaceSchema.findById(workspaceId);
      const organization = await organizationSchema.findById(workspace.Organization);

      const rights = organization.userRights(currentUser);
      
      if (organization.isOwner(currentUser) || organization.isAdmin(currentUser) || workspace.isProductManager(currentUser))
        await workspace.removeUser(userId);
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
          console.error(err)
          return socket.emit('[Workspace] - remove', 'Please recharge the page');
        } else return socket.emit('[Workspace] - remove', null, html, workspaceId);
      });

    } catch (error) {
      console.error(error);
      socket.emit('[Workspace] - remove', 'Intern Error - Cannot remove the user');
    }
  });
}
