//TODO: REMOVE IT ?
const workpsaceSchema = require('../../models/Workspace');
const assemblySchema = require('../../models/Assembly');
const nodeSchema = require('../../models/Node');
const NodeTypeEnum = require('../../enum/NodeTypeEnum');

module.exports = (io, socket) => {
  socket.on('[Workspace] - add', async (name, Owner) => {
    const {currentOrganization} = socket.handshake.session;

    const workpsace = await workpsaceSchema.create({
      name,
      Organization: currentOrganization,
    });

    const assembly = await assemblySchema.create({
      name,
      Organization: currentOrganization,
    });

    await assembly.save();
    const node = await nodeSchema.create({
      name,
      type: NodeTypeEnum.assembly,
      content: assembly._id,
      Workspaces: workspace._id
    });
    
    await node.save();
    workspace.nodeMaser = node._id;
    await workpsace.save();
  });
};
