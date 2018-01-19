let nodemailer = require('nodemailer');
let emailConfig = require("../config/welcomeEmail");

let transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
        user: emailConfig.email,
        pass: emailConfig.password
    }
});

module.exports = transporter;
