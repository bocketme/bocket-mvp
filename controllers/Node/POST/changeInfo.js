const nodeModel = require('../../../models/Node');
const workspaceModel = require('../../../models/Workspace');
const log = require('../../../utils/log');


function addSpec(req, res) {
  try {
    const { nodeId } = req.params;
    const { name, description } = req.body;

    const node = await nodeModel.findById(nodeId);

    if (!node) return res.status(404).send('Not Found');

    const workspace = await workspaceModel.findById(node.Workspace);

    const { userId } = req.session;
    const rights = workspace.hasRights(userId);

    if (!rights || rights === 1)
      return res.status(403).send('Forbidden');

    node.name = name;
    ndoe.description = description;

    await node.save();
    return res.status(200).send();
  } catch (error) {
    log.error(error);
    return res.status(500).send('Intern Error');
  }
}

module.exports = addSpec;

