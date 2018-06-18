const userSchema = require('../../../models/User');
const path = require('path');
const FileSystemConfig = require('../../../config/FileSystemConfig');

module.exports = async (req, res) => {
  try {
    0
    const userId = req.params;
    const user = await userSchema.findById(userId);
    const chemin = path.join(FileSystemConfig.appDirectory.avatar, user.avatar);
    res.sendFile(chemin);
  } catch (err) {
    console.error(err);
    res.status(404).send('Not Found');
  }
}
