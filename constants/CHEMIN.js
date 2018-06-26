const { resolve, join } = require('path');
const DATA = resolve("./.data");
const FILES3D = join(DATA, "files");
const AVATAR = join(DATA, "avatar");
const TMP = join(DATA, "tmp");

module.exports = {
  APP: {
    DATA,
    FILES3D,
    AVATAR,
    TMP,
  },

  CONTENT: {
    "3D": 'file3D',
    NODES: 'nodes',
    SPEC: 'spec',
    TMP: 'tmp',
  },
};
