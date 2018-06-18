const userSchema = require('../../models/User');
const organizationSchema = require('../../models/Organization')
const log = require('../../utils/log')

const changeOption = async (req, res, next) => {
  try {
    if (!req.query || req.query == {})
      return next();

    const { celShading, unit } = req.query;
    const user = await userSchema.findById(req.session.userId);

    if (!user)
      return next();

    if (celShading)
      user.options.celShading = celShading;
    else if (unit)
      user.options.unit = unit;

    await user.save();
    return next();
  } catch (e) {
    log.error(e);
    next(e);
  }
};

const changeInformation = async (req, res, next) => {
  try {
    const { userId } = req.session;

    const workspace = await workspaceSchema.findById(id);
    const organization = await organizationSchema.findOne({ 'Workspaces': id });

    if (!workspace) {
      res.status(404).send('Not Found');
      throw new Error('Cannot find the workspace');
    }

    const isOwner = organization.isOwner(userId),
      isAdmin = organization.isAdmin(userId),
      isProductManager = workspace.isProductManager(userId);

    if (!(isOwner || isAdmin || isProductManager)) {
      res.status(403).send('Forbidden');
      throw new Error('[Workspace Update] - The user has no rights')
    }

    const name = req.body.name || workspace.name;
    const description = req.body.description || workspace.description;

    workspace.name = name;
    workspace.description = description;

    await workspace.save();
    log.info(`/organization/${organizationId}/workspaces#${workspace._id}`);
    return res.redirect(`/organization/${organizationId}/workspaces#${workspace._id}`);
  } catch (e) {
    log.error(e);
    next(e);
  }
}

module.exports = { changeOption, changeInformation };
