const organizationSchema = require('../../../models/Organization');
const userSchema = require('../../../models/User');

async function workspaces(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;

    const organization = await organizationSchema
      .findById(organizationId)
      .populate('Owner').populate('Admins')
      .populate('Members').populate('Workspaces')
      .populate({
        path: 'Workspaces',
        populate: { path: 'ProductManagers', select: 'completeName' }
      })
      .populate({
        path: 'Workspaces',
        populate: { path: 'Observers', select: 'completeName' }
      })
      .populate({
        path: 'Workspaces',
        populate: { path: 'Teammates', select: 'completeName' }
      })
      .exec();


    if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');
    const rights = organization.userRights(userId);

    const user = await userSchema
      .findById(userId)
      .populate('Manager.Organization')
      .populate('Manager.Workspaces')
      .populate({
        path: 'Manager.Workspaces',
        populate: { path: 'ProductManagers', select: 'completeName' }
      })
      .populate({
        path: 'Manager.Workspaces',
        populate: { path: 'Teammates', select: 'completeName' }
      })
      .populate({
        path: 'Manager.Workspaces',
        populate: { path: 'Observers', select: 'completeName' }
      })
      .exec()
      .catch(err => console.error(err));

    if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

    const managerOrganization = user.get('Manager');

    const index = user.Manager.findIndex(manager => {
      const res = String(manager.Organization._id) === String(organizationId);
      return res
    });

    if (index === -1) throw new Error('Cannot find the organization');

    let workspaces = rights > 4 ? organization.Workspaces : user.Manager[index].Workspaces;
    function isWorkspaceManager(workspace) {
      function even(manager) {
        return manager._id.equals(user._id)
      }
      workspace.isProductManager = workspace.ProductManagers.some(even);
      return workspace;
    }

    workspaces = workspaces.map(isWorkspaceManager);

    let listOrganizations = user.Manager.map(({ Organization }) => Organization);
    listOrganizations = listOrganizations.filter(({ _id }) => !_id.equals(organizationId));

    console.log(workspaces)

    const html = {
      currentOrganization: organization,
      OrganizationUsers: organization.users,
      userOrganizations: listOrganizations,
      userWorkspaces: user.Manager[index].Workspaces,
      workspaces: workspaces,
      workspace: workspaces[0],
      currentUser: {
        completeName: user.completeName,
        _id: user._id,
        email: user.email,
        rights: rights
      }
    }

    return res.render('organizationSettings/workspaces', html);
  } catch (e) {
    log.error(e);
    res.redirect('/')
  }
}

module.exports = workspaces;
