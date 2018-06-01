const organizationSchema = require('../../../models/Organization');
const userSchema = require('../../../models/User');

async function index(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;

    const organization = await organizationSchema
      .findById(organizationId)
      .populate('Workspaces')
      .populate('Owner', 'completeName')
      .populate('Admins', 'completeName')
      .populate('Members', 'completeName')
      .exec();

    const rights = organization.userRights(userId);

    if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

    const user = await userSchema
      .findById(userId)
      .populate('Manager.Organization')
      .populate('Manager.Workspaces')
      .exec();

    if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

    const index = user.Manager.findIndex(manager => {
      const res = String(manager.Organization._id) === String(organizationId);
      return res
    });

    if (index === -1) throw new Error('Cannot find the organization');

    let listOrganizations = user.Manager.map(({ Organization }) => Organization);
    listOrganizations = listOrganizations.filter(({ _id }) => !_id.equals(organizationId));

    const html = {
      currentOrganization: organization,
      OrganizationUsers: organization.users,
      userWorkspaces: user.Manager[index].Workspaces,
      userOrganizations: listOrganizations,
      currentUser: {
        completeName: user.completeName,
        _id: user._id,
        email: user.email,
        rights: rights
      },
    }

    return res.render('organizationSettings/organization', html);
  } catch (e) {
    log.error(e);
    res.redirect('/');
  }
}

module.exports = index;
