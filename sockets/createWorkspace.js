const userSchema = require('../models/User'),
    workspaceSchema = require('../models/Workspace'),
    organizationSchema = require('../models/Organization'),
    nodeSchema = require('../models/Node');

const pino = require('pino')();

module.exports = (io, socket) => {

    socket.on("signInNewWorkspace", (userId, orga, workspace) => {
        (async () => {

            let user;
            try {
                user = await userSchema.findById(userId);
            } catch (e) {
                return new Error(e)
            }

            let organization;

            if (orga.type === "create") {
                try {
                    organization = await organizationSchema.craete({
                        name: orga.name,
                        owner: [{
                            _id: user._id,
                            completeName: user.completeName,
                            email: user.email,
                        }],
                        members:[{
                            _id: user._id,
                            completeName: user.completeName,
                            email: user.email,
                        }]
                    });
                    await organization.save();
                } catch (err) {
                    return new Error(e)
                }
            } else if (orga.type === "search") {
                try {
                    organization = await organizationSchema.findById(orga._id);
                } catch (e) {
                    return new Error(e)
                }
            } else {
                pino.error("Type of orga false or inexisting " + orga.type);
                socket.emit("newOrgaFailed");
            }

            let nodeMaster;

            try {
                nodeMaster = await nodeSchema.create({

                });
                await nodeMaster.save();
            } catch (e) {
                return new Error(e);
            }

            let Workspace;

            try {
                Workspace = await workspaceSchema.create({
                    name: workspace.name,
                    owner: [{
                        _id: user._id,
                        completeName: user.completeName,
                        email: user.email,
                    }],
                    node_master: {
                        _id: nodeMaster._id,
                        name: nodeMaster.name,
                        type: NodeTypeEnum.assembly,
                    },
                    organization: {
                        _id: organization._id,
                        name: organization.name,
                    }
                });

                await Workspace.save();
            } catch (e) {
                return new Error(e)
            }

            try {

            } catch (e){
                return new Eroor(e);
            }
        })
            .catch(err => pino.error(err));
    });


};