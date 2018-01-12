let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
let uid = require("uid-safe");
let mailTransporter = require("../utils/mailTransporter");
let Twig = require("twig");
let serverConfig = require("../config/server");

const mailConfig = require("../config/welcomeEmail");

let nestedPeopleSchema = mongoose.Schema({
    completeName : String,
    email: {type : String, required: true}
});

let nestedWorkspaceSchema = mongoose.Schema({
    name : {type: String, required : true },
    id : {type: String, required : true}
});

let InvitationSchema = mongoose.Schema({
    uid: { type: String, default: "" },
    author : {type : String, required: true},
    workspace : {type: nestedWorkspaceSchema, required: true},
    people : { type : nestedPeopleSchema }
});

InvitationSchema.pre('save', function (next) {
    let invitation = this;
    uid(42)
        .then(uid => {
            invitation.uid = uid;
            console.log("UID = ", invitation.uid);
            next();
        })
        .catch(err => next(err));
});

InvitationSchema.post('save', function (invitation) {

    console.log("ici");
    let renderVar = {
        completeName: invitation.completeName,
        workspace: invitation.workspace,
        author : invitation.author,
        url: serverConfig.url + "/" + invitation.uid
    };
    //http://localhost:8080/project/5a4f4a87488d0c0770f8bef0
    Twig.renderFile('./views/email.twig', renderVar, function (err, html) {
        let mailOptions = {
            from: mailConfig.email,
            to: invitation.people.email,
            subject: 'Sending Email using Node.js',
            html: html
            //html: `uid = <a href="google.com">${invitation.uid}</a>`
        };

        mailTransporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
    });
});

nestedPeopleSchema.plugin(uniqueValidator);
nestedWorkspaceSchema.plugin(uniqueValidator);
InvitationSchema.plugin(uniqueValidator);

let Invitation = mongoose.model("Invitation", InvitationSchema, "Invitations");

module.exports = Invitation;
