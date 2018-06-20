const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');

const log = require('../../utils/log');

module.exports = { leaveOrganization, transfertOwnership };

async function leaveOrganization(req, res, next) {
  try {
    console.log(req.body, req.query,)
    const { organizationId, newOwner } = req.params;
    const { userId } = req.session;
    const organization = await organizationSchema.findById(organizationId);
    if (!organization) throw new Error('[Organization] - Cannot Find the organization');

    switch (organization.userRights(userId)) {
      case 6:
        if (!newOwner) {
          log.error(new Error('[Organization] - Put - Cannot find the new owner'));
          return res.status(400).send('Bad Request');
        }
        await organization.changeOwner(newOwner);
        break;
      case 5:
        await organization.deleteAdmin(userId);
          break;
      case 4:
        await organization.deleteMember(userId);
          break;
      default:
        log.error(new Error('[Organization] - Put - The User has no rights inside this organization'));
        return res.status(401).send('Not Authorized');
        break;
    }
    res.status(200).send();
  } catch (e) {
    log.error(e);
    res.status(500).send('Intern Error');
  }
};

async function transfertOwnership(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;
    const { newOwner } = req.session;
    const organization = await organizationSchema.findById(organizationId);
    if (!organization) throw new Error('[Organization] - Cannot Find the organization');

    if (!organization.isOwner(userId)) throw new Error('[Organization] - The user has not the rights required');

    await organization.transfertOwnership(newOwner);

    res.status(200).send()
  } catch (e) {
    log.error(e);
    res.status(500).send('intern Error');
  }
}


const organizationInfo = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;
    const { organizationName } = req.body;

    const organization = await organizationSchema.findById(organizationId);

    const hasRight = organization.isOwner(userId) && organization.isAdmin(userId);

    if (!hasRight)
      throw new Error('[Organization] - Cannot change the organizationName');

    organization.name = organizationName || organization.name;
    await organization.save();
    return res.redirect(`/organization/${organizationId}/workspaces/`);
  } catch (e) {
    log.error(e);
    next(e);
  }
};
