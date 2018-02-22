const userSchema = require('../models/User');
const workspaceSchema = require('../models/Workspace');
const organizationSchema = require('../models/Organization');
const assemblySchema = require('../models/Assembly');
const nodeSchema = require('../models/Node');
const teamSchema = require('../models/Team');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const log = require('../utils/log');
const nodeMasterConfig = require('../config/nodeMaster');
const twig = require('twig');

module.exports = (io, socket) => {
  socket.on("createWorkspaceInHub", (organizationInfo, workspaceInfo) => {
    (async () => {
      let currentSession = socket.handshake.session;
      let user;
      try {
        user = await userSchema.findOne({ email: currentSession.userMail, completeName: currentSession.completeName });
        if (!user)
          throw new Error("There is no user found");
      } catch (err) {
        throw new Error("Cannot get the User. Exciting 'createWorkspaceInHub' socket ...\n" + err);
      }


      let organization;
      try {
        if (organizationInfo.type === "new") {
          organization = await organizationSchema.create({
            name: organizationInfo.name,
            owner: [{
              _id: user._id,
              completeName: user.completeName,
              email: user.email,
            }],
            members: [{
              _id: user._id,
              completeName: user.completeName,
              email: user.email,
            }],
          });

          await organization.save();

        } else if (organizationInfo.type === "search") {
          organization = await organizationSchema.findOne({ "_id": organizationInfo._id, name: organizationInfo.name });

          if (!organization)
            throw new Error("Initialize a new organization");
        } else {
          throw new Error("The instruction type is incorrect or non-existent : " + organizationInfo.type);
        }

      } catch (err) {
        if (organization && organizationInfo.type === "new") {
          try {
            await organization.remove();
          } catch (err) {
            log.fatal("[Critical Failure] - Cannot delete non existing organization");
            throw new Error();
          }
        }
        throw new Error("Cannot get/create the Organization. Exciting 'createWorkspaceInHub' socket ...\n" + err);
      }

      let assembly;
      try {
        assembly = await assemblySchema.create({
          name: workspaceInfo,
          description: nodeMasterConfig.description,
          ownerOrganization: {
            _id: organization._id,
            name: organization.name,
          },
          creator: {
            _id: user._id,
            completeName: user.completeName,
            email: user.email,
          },
        });

        await assembly.save();
      } catch (err) {
        throw new Error("Cannot get an assembly \n" + err);
      }

      let team;

      try {
        team = await teamSchema.create({
          owners: [{
            _id: user._id,
            completeName: user.completeName,
            email: user.email,
          }],
          members: [{
            _id: user._id,
            completeName: user.completeName,
            email: user.email,
          }],
        });

        await team.save();
      } catch (err) {
        throw new Error("Cannot create the team \n" + err);
      }

      let nodeMaster;

      try {
        nodeMaster = await nodeSchema.create({
          name: workspaceInfo,
          type: NodeTypeEnum.assembly,
          content: assembly._id,
          team: {
            _id: team._id,
            owners: [{
              _id: user._id,
              completeName: user.completeName,
              email: user.email
            }],
            members: [{
              _id: user._id,
              completeName: user.completeName,
              email: user.email
            }]
          }
        });
        await nodeMaster.save();
      } catch (err) {
        throw Error("Cannot create the nodeMaster \n" + err);
      }

      let workspace;
      try {
        workspace = await workspaceSchema.create({
          name: workspaceInfo,
          owner: {
            _id: user._id,
            completeName: user.completeName,
            email: user.email,
          },
          node_master: {
            _id: nodeMaster._id,
            name: nodeMaster.name,
            type: NodeTypeEnum.assembly,
          },
          organization: {
            _id: organization._id,
            name: organization.name
          },
          team: {
            _id: team._id,
            owners: team.owners,
            members: team.members,
          },
        });


        await workspace.save();

        user.workspaces.push(workspace);
        await user.save();

        organization.workspaces.push(workspace);
        await organization.save();
      } catch (err) {

        try {

          if (assembly)
            await assembly.remove();
          if (nodeMaster)
            await nodeMaster.remove();
          if (workspace)
            await workspace.remove();
          if (organization && organizationInfo.type === "create")
            await organization.remove();

        } catch (err) {
          log.fatal("[Critical Failure] - " + err);
        }
        throw new Error("Cannot create the Workspace. Exciting 'createWorkspaceInHub' socket ...\n" + err);
      }
      return user.workspaces;
    })()
      .then((workspaces) => {
        log.info("Finish");
        twig.renderFile("./views/hub/listWorkspaces.twig", {
          workspaces: workspaces
        }, (err, res) => {
          if (err)
            return Promise.reject(err);
          return socket.emit("updateWorkspaceList", res);
        });
      })
      .catch((err) => log.error(err));

  });
};