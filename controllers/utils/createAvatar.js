const fs = require('fs'),
  path = require('path');

function createAvatar(chemin, spec) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path.join(chemin, spec.originalname))) {
      fs.unlinkSync(path.join(chemin, spec.originalname));
    }
    fs.writeFile(path.join(chemin, spec.originalname), spec.buffer, err => {
      if (err)
        return reject(err);
      resolve();
    });
  });
}

module.exports = createAvatar;
