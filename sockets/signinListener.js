//let escape = require('escape-html');
let internalErrorEmitter = require("./emitter/internalErrorEmitter");
let User = require("../models/User");
let Workspaces = require("../models/Workspace");
let acceptInvitation = require("../utils/Invitations/acceptInvitation");

module.exports = function (socket) {
    socket.on("signin", (accountInformation) => { // accountInformation.email & accountInformation.password && invitationUid (optional)
        console.log("AccountInformation = ", accountInformation);

        /*accountInformation.email = escape(accountInformation.email);
        accountInformation.password = escape(accountInformation.password);*/

        User.findOne({email: "" + accountInformation.email})
            .then(user => {
                //console.log("Signin listner : ", user);
                if (user !== null)
                {
                    user.comparePassword(accountInformation.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch)
                        {
                            findAllWorkspaces(user.workspaces)
                                .then(workspaces => {
                                    if (!accountInformation.invitationUid)
                                        socket.emit("signinSucced", {workspaces : workspaces, user: user});
                                    else
                                        emitWithInvitation(accountInformation, user, socket);
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
                console.log(err);
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
