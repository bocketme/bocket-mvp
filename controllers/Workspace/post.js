const userSchema = require('../../models/User');
const organizationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');
const isMongoId = require('validator/lib/isMongoId')

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
    next(e);
  }
};

const addOrganizationMember = async (req, res, next) => {
  try {
    const { userId, currentOrganization } = req.session;
    const { workspaceId } = req.params;

    console.log(req.body);
    const organization = await organizationSchema.findById(currentOrganization)
    if (!organization) throw new Error('Cannot find the organization');

    const workspace = await workspaceSchema.findById(workspaceId);
    if (!workspace) throw new Error('Cannot find The workspace');

    const hasRights = organization.isAdmin(userId) || organization.isOwner(userId) || workspace.isProductManager(userId);
    if (!hasRights) throw new Error('The current user has no rights');

    const _id = Array.isArray(req.body["_id[]"]) ? req.body["_id[]"] : [req.body["_id[]"]];
    const role = Array.isArray([req.body["role[]"]]) ? req.body["role[]"] : [req.body["role[]"]];
    console.log(_id, role)
    for (let i = 0; i < _id.length; i++) {
      const user = { _id: _id[i], role: role[i] };
      if (!isMongoId(user._id)) throw new Error('Cannot invite this user')
      switch (Number(user.role)) {
        case 3:
          await workspace.addProductManager(user._id);
          break;
        case 2:
          await workspace.addTeammate(user._id);
          break;
        case 1:
          throw new Error('Cannot Invite Observer');
          await workspace.addObserver(user._id);
          break;
        default:
          throw new Error('Cannot understand the role of an user');
          break;
      }
    }
    res.status(200).send();
  } catch (e) {
    log.error(e);
    next(e);
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

module.exports = { indexPost, createWorkspace, addOrganizationMember };
