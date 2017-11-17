const isEmail = require('isemail'); // EMAIL CHECKER

/* SocketListeners */
const internalErrorListener = require

/* Mailer */
const nodemailer = require('nodemailer');

/* MODELS */
const BetaEmail = require("../models/BetaEmail");

function sendMail(receiver, subject, text) {
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "leads.bocket@gmail.com", // generated ethereal user
                pass:   "bocketme"// generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"leads bocket" <leads.bocket@gmail.com>', // sender address
            to: receiver, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            //html: '<b>Hello world?</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}

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
                        sendMail("leads@bocket.me", "Yeeepa! New user incoming 🚀🚀🚀", email);
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