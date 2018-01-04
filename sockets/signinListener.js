//let escape = require('escape-html');
let internalErrorEmitter = require("./emitter/internalErrorEmitter");
let User = require("../models/User");
let Workspaces = require("../models/Workspace");
let signInUserSession = require("../utils/signInUserSession");

module.exports = function (socket) {
    socket.on("signin", (accountInformation) => { // accountInformation.email & accountInformation.password
        console.log(accountInformation);

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
                                    socket.emit("signinSucced", {workspaces : workspaces, user: user});
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