const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');
const _ = require('lodash');
module.exports = (io, socket) => {
  socket.on('[Workspace] - changeRights', async (workspaceId, newRole, id) => {
    const userId = socket.handshake.session.userId;
    const workspace = await workspaceSchema.findById(workspaceId);
    const organization = await organizationSchema.findOne({ 'Workspaces': workspaceId });
    const user = await userSchema.findById(userId);

    const Owner = organization.get('Owner');
    const Admins = organization.get('Admins');

    for (let i = 0; i < workspace.ProductManagers.length; i++) {
      if (workspace.ProductManagers[i].equals(user._id)) {
        const ProductManagers = workspace.get('ProductManagers');
        const Members = workspace.get('Members');
        const Observers = workspace.get('Observers');

        function filterUserId(u) {
          return !(u.equals(user._id));
        }

        workspace.ProductManagers = _.filter(ProductManagers, filterUserId);
        workspace.Members = _.filter(Members, filterUserId);
        workspace.Observers = _.filter(Observers, filterUserId);

        switch (newRole) {
          case 'ProductManager':
            workspace.ProductManagers.push(user._id);
            break;
          case 'Member':
            workspace.Members.push(user._id);
            break;
          case 'Observer':
            workspace.Observers.push(user._id);
            break;
          default:
            throw new Error('Cannot understand the new role : ', newRole);
            break;
        }
        await workspace.save();
        return;
      }
    }
  });
};
