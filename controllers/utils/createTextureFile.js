const path = require('path');
const fs = require('fs');
const FSconfig = require('../../config/FileSystemConfig');

/**
 * Create the file Texture Needed For The 3D File
 * 
 * @param {String} chemin 
 * @param {Object} textureFile 
 */
const createTextureFile =
  (chemin, textureFile) => new Promise((resolve, reject) => {
    fs.writeFile(path.join(chemin, FSconfig.content.data, textureFile.originalname), textureFile.buffer, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

module.exports = createTextureFile;