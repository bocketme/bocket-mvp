const UserSchema = require('../../models/User'),
  serverConfig = require('../../config/server'),
  fs = require('fs'),
  path = require('path');

const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout);
const log = pino({
  name: 'app',
  safe: true
}, pretty);

let userImage = async (req, res) => {
  let user;

  try {
    user = await UserSchema.findById(req.params.userId);
  } catch (e) {
    log.error(e);
    return res.status(500).send('Intern Error');
  }

  if (!user)
    return res.status(400).send('Not Found');
  let file = path.join(serverConfig.avatar, user.avatar);
  return res.sendFile(file, (err) => {
    if (err)
      log.error(err);
    res.status(400).send('Not Found');
  });
};

let get = {userImage};

module.exports = get;
