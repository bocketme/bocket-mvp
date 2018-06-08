const userSchema = require('../models/User');
const workspaceSchema = require('../models/Workspace');
const organizationSchema = require('../models/Organization');
const assemblySchema = require('../models/Assembly');
const nodeSchema = require('../models/Node');
const teamSchema = require('../models/Team');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const log = require('../utils/log');
const nodeMasterConfig = require('../config/nodeMaster');

module.exports = (io, socket) => {
  socket.on('signInNewWorkspace', async (userId, orga, workspaceName) => {
    try {
      const user = await userSchema.findById(userId).populate('Organization.workspaces');
      if (!user) throw new Error('Cannot find the user');
      const organization = await findOrCreate(orga.type, orga, userId);

      const assembly = await assemblySchema.create({
        name: workspaceName,
        description: nodeMasterConfig.description,
        Organization: organization._id,
        creator: user._id
      });
      await assembly.save();

      const nodeMaster = await nodeSchema.create({
        name: workspaceName,
        description: nodeMasterConfig.description,
        Organization: organization._id,
        creator: user._id
      })
      await nodeMaster.save();

      const workspace = await workspaceSchema.create({
        name: workspaceName,
        owner: user,
        nodeMaster: nodeMaster._id,
        Organization: organization._id,
      });

      await workspace.save();

      const ownerOrganization = await organizationSchema.find({'Owner': user._id}).select('name');

      const organizationManager = user.get('Organization');
      //TODO: Workspaces

      return socket.emit("signinSucced", {
        user: user,
        workspaces: workspaces,
        organization: ownerOrganization,
      });

    } catch (error) {
      console.error(error);
    }
  });

  async function findOrCreate(type, orga, userId) {
    let organization;
    switch (type) {
      case 'new':
        organization = await organizationSchema.create({
          name: orga.name,
          Owner: userId,
        });
        await organization.save();
        break;
      case 'search':
        organization = await organizationSchema.findById(orga._id);
        if (!organization) throw new Error('Cannot Find The Organization')
        break;
      default:
        throw new Error('Cannot understand the command');
        break;
    }
    return organization;
  }
};
