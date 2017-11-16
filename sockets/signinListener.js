let internalErrorEmitter = require("./emitter/internalErrorEmitter");
let User = require("../models/User");

module.exports = function (socket) {
    socket.on("signin", (accountInformation) => {
        console.log(accountInformation);
        User.findOne({email: "" + accountInformation.email})
            .then(user => {
                console.log("Signin listner : ", user);
                if (user !== null)
                {
                    user.comparePassword(accountInformation.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch)
                            socket.emit("signinSucced");
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