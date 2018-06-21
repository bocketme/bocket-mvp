const organizationSchema = require('../../models/Organization');
const userSchema = require('../../models/User');

const log = require('../../utils/log');

module.exports = main;
async function main(req, res, next) {
  try {
    const { organizationId } = req.params;
    const { userId } = req.session;
    const organization = await organizationSchema.findById(organizationId);
    if (!organization) throw new Error('[Organization] - Cannot Find the organization');

    if (!organization.isOwner(userId)) throw new Error('[Organization] - The user has not the rights required');

    await organization.remove();

    res.status(200).send();
  } catch (e) {
    log.error(e);
    res.status(500).send('Intern Error');
  }
}
