const userSchema = require('../../../models/User');
const log = require('../../../utils/log');

module.exports = async function userOwnership(req, res) {
  try {
    const { userId } = req.session;
    const user = await userSchema.findById(userId);
    const organizations = await user.organizationOwner();
    return res.render('socket/userOwnership.twig', { organizations });
  } catch (e) {
    log.error(e);
    res.status(500).send('Intern Error');
  }
};
