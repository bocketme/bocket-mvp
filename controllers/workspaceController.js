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

  const isOwner = organization.isOwner(userId);
  const isProductManager = workspace.isProductManager(userId);

  if (isOwner || isProductManager) {
    workspace.name = name;
    workspace.description = description;
    await workspace.save();

  } else throw new Error('Cannot make changes, you have no right');

  return organization._id;
}
