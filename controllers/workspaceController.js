const workspaceSchema = require('../models/Workspace');
const organizationSchema = require('../models/Organization');

module.exports = {
  changeInfo: (req, res) => {
    const { name, description } = req.body;
    const { workspaceId } = req.params;
    const { userId } = req.session;
    changeData(workspaceId, userId, name, description)
    .then((organizationId) => {
      res.redirect(`/organization/${organizationId}/workspaces`);
    })
    .catch((err) => {
      console.error(err);
      res.redirect('');      
    });
  }
}

const changeData = async (id, userId, name, description) => {
  const workspace = await workspaceSchema.findById(id);
  const organization = await organizationSchema.findOne({ 'Workspaces': id });
  if (!workspace) throw new Error('Cannot find the workspace');

  const productManagers = workspace.get('ProductManagers');

  const user = String(userId);

  for (let i = 0; i < productManagers.length; i++) {
    const manager = productManagers[i];
    const managerId = String(manager)
    if (managerId === user) {
      workspace.name = name;
      workspace.description = description;
      await workspace.save();
      return organization._id;
    }
  }

  const Owner = organization.get('Owner')
  const owner = String(Owner);

  if (owner === user) {
    workspace.name = name;
    workspace.description = description;
    await workspace.save();
    return organization._id;
  }

  const admins = organization.get('Admins');
  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i];
    const adminId = String(manager)
    if (adminId === user) {
      workspace.name = name;
      workspace.description = description;
      await workspace.save();
      return organization._id;
    }
  }
  throw new Error('Cannot make changes, you have no right')
}
