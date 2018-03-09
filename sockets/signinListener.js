//let escape = require('escape-html');
let internalErrorEmitter = require("./emitter/internalErrorEmitter");
let User = require("../models/User");
let Workspaces = require("../models/Workspace");
let Organization = require("../models/Organization");
let acceptInvitation = require("../utils/Invitations/acceptInvitation");

const log = require('../utils/log');

module.exports = function (socket) {
    socket.on("signin", (accountInformation) => { // accountInformation.email & accountInformation.password && invitationUid (optional)
        log.info("AccountInformation = ", accountInformation);

        /*accountInformation.email = escape(accountInformation.email);
        accountInformation.password = escape(accountInformation.password);*/

        User.findOne({email: "" + accountInformation.email})
            .then(user => {
                //log.info("Signin listner : ", user);
                if (user !== null)
                {
                    user.comparePassword(accountInformation.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch)
                        {
                            findAllWorkspaces(user.workspaces)
                                .then(workspaces => {
                                    findOwnerOrganization(user.id)
                                        .then((organization) => {
                                            if (!accountInformation.invitationUid)
                                                socket.emit("signinSucced", {workspaces : workspaces, user: user, organization: organization});
                                            else
                                                emitWithInvitation(accountInformation, user, socket);
                                        })
                                        .catch(err => {
                                            socket.emit("signinFailed");
                                        });
                                })
                                .catch(err => {
                                    socket.emit("signinFailed");
                                });
                        }
                        else
                            socket.emit("signinFailed");
                    });
                }
                else
                    socket.emit("signinFailed");
            })
            .catch(err => {
                log.error(err);
                internalErrorEmitter(socket);
            });
    });
};

function findAllWorkspaces(nestedWorkspaces) {
    let workspaces = [];

    return new Promise((resolve, reject) => {
        let i = 0;
        nestedWorkspaces.forEach(workspace => {
            Workspaces.findOne({_id : workspace._id})
                .then(w => {
                    workspaces.push(w);
                    i += 1;
                    if (i === nestedWorkspaces.length)
                    {
                        //console.log("findAllWorkspaces : ", workspaces);
                        resolve(workspaces);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        });
    });
}

function emitWithInvitation(accountInformation, user, socket) {
    acceptInvitation(accountInformation.invitationUid, user)
        .then((res) => socket.emit("signinSucced", res.workspaceId))
        .catch((err) => {
            console.log(err);
            internalErrorEmitter(socket)
        });
}

function findOwnerOrganization(userId) {
    return new Promise((resolve, reject) => {
        Organization.find({"owner._id": userId})
            .then(orga => {
                if (!orga)
                    resolve(null);
                resolve(orga);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
}