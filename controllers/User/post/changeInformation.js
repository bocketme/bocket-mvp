const userSchema = require('../../../models/User');

module.exports = async function changeInformation(req, res) {
  try {
    const { userId } = req.session;
    const { completeName, Email } = req.body;

    const user = await user.findById(userId);

    user.completeName = completeName;
    user.email = Email;

    await user.save();
    res.status(200).send('OK');
  } catch (error) {
    log.error(new Error(error));
    res.status(500).send('Intern Error');
  }
}
