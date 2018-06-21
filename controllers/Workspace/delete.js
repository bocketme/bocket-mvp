const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');
const { isMongoId } = require('validator');
const log = require('../../utils/log');

async function deleteWorkspace(req, res, next) {
  try {
    console.log(req.params.workspaceId);
    const workspace = await workspaceSchema.findById(req.params.workspaceId);
    const organization = await organizationSchema.findById(workspace.Organization);

    const { userId } = req.session;

    if (workspace.isProductManager(userId) || organization.isOwner(userId) || organization.isAdmin(userId))
      await workspace.remove();

    return res.status(200).send();
  } catch (e) {
    log.error(e);
    return next(e);
  }
}

module.exports = { deleteWorkspace };
