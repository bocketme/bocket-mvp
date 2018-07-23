const userSchema = require('../../../models/User');
const organziationSchema = require('../../../models/Organization');
const log = require('../../../utils/log');
/**
 * Render the user settings page
 */
module.exports = async function (req, res) {
  try {
    const { userId } = req.session;
    const organizationId = req.session.currentOrganization;

    const currentUser = await userSchema
      .findById(userId);

    if (!currentUser) {
      console.error(new Error('[User] : render - Cannot find the user'));
      return res.status(404).send('Not Found');
    }

    await currentUser
      .populate('Manager.Workspaces')
      .populate('Manager.Organization')
      .execPopulate();

    let organizationIndex = currentUser.Manager.findIndex(({ Organization }) => Organization._id.equals(organizationId));
    let currentOrganization = currentUser.Manager[organizationIndex === -1 ? currentOrganization : 0].Organization;
    let userWorkspaces = currentUser.Manager[organizationIndex === -1 ? currentOrganization : 0].Workspaces;

    const Organizations = [];
    for (let i = 0; i < currentUser.Manager.length; i++) {
      const { _id } = currentUser.Manager[i].Organization;
      const organization = await organziationSchema.findById(_id);
      if (organization) {
        switch (organization.userRights(userId)) {
          case organization.OWNER:
            Organizations.push({
              _id: organization._id,
              name: organization.name,
              status: "Owner"
            });
            break;
          case organization.ADMIN:
            Organizations.push({
              _id: organization._id,
              name: organization.name,
              status: "Co-owner"
            });
            break;
          case organization.MEMBER:
            Organizations.push({
              _id: organization._id,
              name: organization.name,
              status: "Member"
            });
            break;
          default:
            log.warn('Cannot find the role of the user, skipping...');
            break;
        }
      } else log.warn('Cannot find the role of the user, skipping...');
    }

    return res.render('./userSettings/index.twig', { currentUser, currentOrganization, Organizations, userWorkspaces });
  } catch (error) {
    console.error(new Error(error));
    return res.status(500).send('Intern Error');
  }
}
