const userSchema = require('../../models/User');
const { isMongoId } = require('validator');
const log = require('../../utils/log');

const indexPost = async (req, res, next) => {
  try {
    const { email, password, workspaceId } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) throw new Error('[Workspace Post] - User Not Found');

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new Error('[Workspace Post] - Password Incorrect');

    req.session.userId = user._id;
    req.session.userMail = user.email;
    req.session.completeName = user.completeName;

    return res.redirect(`workspace/${workspaceId}`);
  } catch (e) {
    log.error(e);
    next(err);
  }
};

const createWorkspace = async (req, res, next) => {
  try {
    const { userId, currentOrganization } = req.session;

    const organization = await organizationSchema.findById(organizationId);
    if (!organization) throw new Error('Cannot find the organization');

    const userAsking = await userSchema.findById(userId)
    if (!userAsking) throw new Error('Cannot find the user');

    if (!(organization.isAdmin(userAsking._id) || organization.isOwner(userAsking._id)))
      throw new Error('The user has no right');

    const productManager = await userSchema.findById(body.productManager);
    if (!productManager) throw new Error('Cannot find the user');

    const assembly = await assemblySchema.create({
      name: body.workspaceName,
      Organization: organization._id,
    });

    const nodeMaster = await nodeSchema.create({
      name: body.workspaceName,
      Organization: organization._id,
      type: NodeTypeEnum.assembly,
      content: assembly._id,
    });

    const workspace = await workspaceSchema.create({
      name: body.workspaceName,
      Organization: organizationId,
      nodeMaster: nodeMaster._id,
    });
    await workspace.save();

    await workspace.addProductManager(productManager._id);

    nodeMaster.Workspace = workspace._id;
    await nodeMaster.save();

    organization.Workspaces.push(workspace._id);
    await organization.save();

    res.redirect(`/organization/${currentOrganization}/workspaces`);
  } catch (e) {
    log.error(e);
    next(e);
  }



}

module.exports = { indexPost };
