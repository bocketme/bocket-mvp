const isEmail = require('isemail'); // EMAIL CHECKER

/* SocketListeners */
const internalErrorListener = require

/* MODELS */
const BetaEmail = require("../models/BetaEmail");

module.exports = function (socket) {
        socket.on("betaRegistration", (email) => {
            console.log("J'ai reçu : " , email);
            let internalError = {
                title: "Internal error !",
                desc: "Please, try again."
            };
            let emailError = {
                title: "Invalid email !",
                desc: internalError.desc
            };
            let sucess = {
                title: "Thank you for your interest !",
                desc: "We will keep you in touch very soon Enjoy your day :)"
            };
            if (isEmail.validate(email) === false) {
                console.log("email invalid");
                socket.emit("betaRegistration", emailError);
                return ;
            }
            BetaEmail.findOne().where("email").equals(email).exec()
                .then(result => {
                    if (result === null)
                    {
                        let betaEmail = new BetaEmail({email : email});
                        betaEmail.save();
                    }
                    socket.emit("betaRegistration", sucess);
                })
                .catch(err => {
                    socket.emit("betaRegistration", internalError);
                    console.error(err);
                });

        });
}