const Workspace = require('../../models/Workspace');
const getContentOfNode = require('../../utils/node/getContentOfNode');
const configServer = require('../../config/server');
const partFileSystem = require('../../config/PartFileSystem');
const Path = require('path');
const formidableWithCb = require('formidable');
const EmptyDirWithCb = require('empty-dir');
const Util = require('util');

const EmptyDir = Util.promisify(EmptyDirWithCb);
const formidable = Util.promisify(formidableWithCb);

function update(req, resp) {
  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
    resp.writeHead(200, {'content-type': 'text/plain'});
    resp.write('received upload:\n\n');
    resp.end(util.inspect({fields: fields, files: files}));
  });
  /* const { file, nodeId } = req.body;
  try {
    const { node, content, type } = await getContentOfNode(nodeId);
    const workspace = await Workspace.findById(req.session.currentWorkspace);

    // if (type != )

    if (!workspace || !node.workspaces.find(elem => elem._id === req.session.currentWorkspace)) {
      return resp.send('404 - Not Found').status(404);
    }

    const directoryPath = Path.join(
      configServer.data,
      configServer.files3D,
      `${workspace.organization.name}-${workspace.organization._id}`,
      `${content.name} - ${content._id}`,
      partFileSystem.data,
    );

    try {
      EmptyDir(directoryPath);
    } catch (err) { return resp.send('500 - Internal Server Error').status(500); }


  } catch (err) {
    return resp.send('404 - Not Found').status(404);
  } */
}


module.exports = update;
