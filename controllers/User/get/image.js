const userSchema = require('../../../models/User');
const path = require('path');
const config = require('../../../config/server');
const log = require('../../../utils/log');
const fs = require('fs');

module.exports = async function getAvatar(req, res) {
  try {
    const { userId } = req.session;
    const user = await userSchema.findById(userId)
    const chemin = path.join(config.avatar, user.avatar);
    const fileBuf = fs.readFileSync(chemin);
    res.status(200).send(fileBuf.toString('base64'));
  } catch (err) {
    log.error(err);
    res.status(404).send('Not Found');
  }
};
