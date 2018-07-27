const User = require('../../../models/User');
const log = require('../../../utils/log');
const config = require('../../../config/server');
const createAvatar = require('../../utils/createAvatar');
const path = require('path');


function getFileExtension(filename = '') {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

module.exports = async function changeAvatar(req, res, next) {
  try {
    const { userId } = req.session;
    const { avatar } = req.files;

    const file = avatar[0];
    const fileExtension = getFileExtension(file.originalname);
    file.originalname = `${userId}.${fileExtension}`;
    const chemin = path.join(config.avatar);
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not Found');
    user.avatar = file.originalname;
    try {
      await createAvatar(chemin, file);
    } catch (err) {
      log.warn(err);
      return res.status(400).send('Error: could not change avatar');
    }
    await user.save();
    return res.status(200).send('OK');
  } catch (error) {
    log.warn(new Error(error));
    return res.status(500).send('Intern Error');
  }
};
