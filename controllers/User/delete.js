const userSchema = require('../../models/User');

module.exports = async (req, res) => {
  try {
    const { userId } = req.session;
    const user = await userSchema.findById(userId);
    const organizationsOwner = await user.organizationOwner();
    await user.remove();
    return res.status(200).json({ organizations: organizationsOwner });
  } catch (e) {
    log.error(e);
    return res.status(500).send('Intern Error');
  }
};
