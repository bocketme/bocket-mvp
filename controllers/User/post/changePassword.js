const userSchema = require('../../../models/User');
const log = require('../../../utils/log');

module.exports = async function changeInformation(req, res, next) {
  try {
    const { userId } = req.session;
    const lastPassword = req.body["user_password"];
    const newPassword = req.body["user_new_password"];
    const confirmPassword = req.body["user_confirm_new_password"];

    const user = await User.findById(userId);

    if (!user) return res.status(404).send('User not Found');

    if (newPassword.length < 6 || confirmPassword < 6 || newPassword !== confirmPassword) {
      return res.status(400).send(`The new password and the confirm password does not match`);
    } else if (await user.comparePassword(lastPassword, user.password) === false) {
      return res.status(401).send('Wrong password');
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).send('OK');
  } catch (error) {
    log.warn(new Error(error));
    return res.status(500).send('Intern Error');
  }
}
