const organizationSchema = require('../../../models/Organization');
const userSchema = require('../../../models/User');
const log = require('../../../utils/log');

async function index(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;

    const user = await userSchema
      .findById(userId)
      .populate('Manager.Organization')
      .populate('Manager.Workspaces')
      .exec();

    if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

    if (user.Manager[0])
      res.locals.redirect = `/organization/${user.Manager[0].Organization._id}`;

    const organization = await organizationSchema
      .findById(organizationId);

    if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

    const rights = organization.userRights(userId);

    await organization
      .populate('Workspaces')
      .populate('Owner', 'completeName')
      .populate('Admins', 'completeName')
      .populate('Members', 'completeName')
      .execPopulate();

    if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

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

    req.session.currentOrganization = organization._id;
    req.session.currentWorkpsace = null;

    return res.render('organizationSettings/organization', html);
  } catch (e) {
    log.error(e);
    if (res.locals.redirect)
      return res.redirect(res.locals.redirect);
    else res.redirect("/signOut");
  }
}

module.exports = index;
