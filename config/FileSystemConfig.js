  const path =              require('path');
  const data =              path.resolve("./.data");
  const files3D =           path.join(data, "files");
  const avatar =            path.join(data, "avatar");
  const tmp =               path.join(data, "tmp");

module.exports = {
  appDirectory: {
    data,
    files3D,
    avatar,
    tmp,
  },

  content: {
    data: 'file3D',
    nodes: 'nodes',
    spec: 'spec',
    tmp: 'tmp'
  }
};