const userSchema = require('../../../models/User');
const path = require('path');
const FileSystemConfig = require('../../../config/FileSystemConfig');
const log = require('../../../utils/log');

module.exports = async (req, res) => {
  try {
    const userId = req.params;
    const user = await userSchema.findById(userId);
    const chemin = path.join(FileSystemConfig.appDirectory.avatar, user.avatar);
    res.sendFile(chemin);
  } catch (err) {
    log.error(err);
    res.status(404).send('Not Found');
  }
};
