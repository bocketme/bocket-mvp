const nodeModel = require('../../../models/Node');
const workspaceModel = require('../../../models/Workspace');
const log = require('../../../utils/log');

async function deleteAccess(req, res) {
  const { nodeId, userId } = req.params;

  const node = await nodeModel.findById(nodeId);

  if (!node) return res.status(404).send('Not Found');

  const workspace = await workspaceModel.findById(node.Workspace);

  const currentUser = req.session.userId;
  const rights = workspace.hasRights(currentUser);

  if (!rights || rights === 1)
    return res.status(403).send('Forbidden');

  
  try {
    await workspace.removeAccess(nodeId, userId);
    return res.json({name: node.name, _id: node._id, user: userId});
  } catch (error) {
    log.error(error);
    return res.status(500).send('Intern Error');
  }
}

module.exports = deleteAccess;
