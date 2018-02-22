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
    socket.on("signInNewWorkspace", (userId, orga, workspaceName) => {
        (async () => {
            
            log.info("search the user");
            let user;
            try {
                user = await userSchema.findById(userId);
            } catch (e) {
                throw new Error(e)
            }
            
            log.info("search / create organization");
            let organization;
            console.log(orga);
            if (orga.type === "new") {
                try {
                    organization = await organizationSchema.create({
                        name: orga.name,
                        owner: [{
                            _id: user._id,
                            completeName: user.completeName,
                            email: user.email,
                        }],
                        members: [{
                            _id: user._id,
                            completeName: user.completeName,
                            email: user.email,
                        }]
                    });
                    await organization.save();
                } catch (e) {
                    throw new Error(e)
                }
            } else if (orga.type === "search") {
                try {
                    organization = await organizationSchema.findById(orga._id);
                } catch (e) {
                    throw new Error(e);
                }
            } else {
                throw new Error("Type of orga false or inexisting : " + orga.type);
                socket.emit("newOrgaFailed");
            }
            
            log.info("create assembly");
            let newassembly;
            try {
                newassembly = await assemblySchema.create({
                    name: workspaceName,
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
                
                await newassembly.save();
            } catch (e) {
                throw new Error(e);
            }
            
            log.info("create team");
            let team;
            
            try {
                team = await teamSchema.create({
                    owners: [{
                        _id: user._id,
                        completeName: user.completeName,
                        email: user.email,
                    }],
                });
                
                await team.save();
            } catch (e) {
                throw new Error(e)
            }
            
            log.info("create nodemaster");
            let nodeMaster;
            
            try {
                nodeMaster = await nodeSchema.create({
                    name: workspaceName,
                    type: NodeTypeEnum.assembly,
                    content: newassembly._id,
                    team: team
                });
                await nodeMaster.save();
            } catch (e) {
                throw new Error(e);
            }
            
            log.info("create workspace");
            let workspace;
            try {
                workspace = await workspaceSchema.create({
                    name: workspaceName,
                    owner: user,
                    node_master: {
                        _id: nodeMaster._id,
                        name: nodeMaster.name,
                        type: NodeTypeEnum.assembly,
                    },
                    organization: {
                        _id: organization._id,
                        name: organization.name,
                    },
                    team: team,
                });
                
                await workspace.save();
            } catch (e) {
                throw new Error(e)
            }
            
            log.info("last changements");
            try {
                nodeMaster.Workspaces.push(workspace);
                await nodeMaster.save();
                
                newassembly.whereUsed.push(nodeMaster._id);
                await newassembly.save();
                
                user.workspaces.push(workspace);
                await user.save();
            } catch (e) {
                throw new Eroor(e);
            }
            
            let workspaces = [];
            try {
                let owners = await workspaceSchema.find({ "team.owners._id": user._id });
                workspaces.push(...owners);
                let members = await workspaceSchema.find({ "team.members._id": user._id });
                workspaces.push(...members);
                let consults = await workspaceSchema.find({ "team.consults._id": user._id });
                workspaces.push(...consults);
            } catch (e) {
                throw new Error(e);
            }
            
            let ownerOrganization;
            
            try {
                ownerOrganization = await organizationSchema.find({ "owner._id": user._id })
            } catch (e) {
                throw new Error(e);
            }
            
            return {
                user: user,
                workspaces: workspaces,
                organization: ownerOrganization,
            }
        })().then((res) => {
            socket.emit("signinSucced", res)
        })
        .catch(err => log.error(err));
    });
    
    
};