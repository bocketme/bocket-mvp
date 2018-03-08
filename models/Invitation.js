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

let nestedOrganization = mongoose.Schema({
    name : {type :String, required: true},
    id : {type :String, required: true},
});

let InvitationSchema = mongoose.Schema({
    uid: { type: String, default: "" },
    author : {type : String, required: true},
    workspace : {type: nestedWorkspaceSchema, required: true},
    organization : {type: nestedWorkspaceSchema, required: true},
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
    console.log("serverConfig url :", serverConfig.url);
    
    let httpURL ="";
    //httpURL = serverConfig.protocol+ "://www.bocket.me:" + serverConfig.port;
    httpURL = serverConfig.protocol+ "://localhost:" + serverConfig.port;
    console.log("http url :", httpURL);
    
    let renderVar = {
        completeName: invitation.people.completeName,
        workspace: invitation.workspace,
        author : invitation.author,
        
        //url: serverConfig.url + "/" + invitation.uid
        url: httpURL + "/" + invitation.uid
        
    };
    //http://localhost:8080/project/5a4f4a87488d0c0770f8bef0
    Twig.renderFile('./views/invitation.twig', renderVar, function (err, html) {
        let mailOptions = {
            from: mailConfig.email,
            to: invitation.people.email,
            subject: 'Someone invited you to collaborate into a bocket 3D workspace',
            html: html
            //html: `uid = <a href="google.com">${invitation.uid}</a>`
        };

        console.log("mailOptions = ", mailOptions);

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
nestedOrganization.plugin(uniqueValidator);

let Invitation = mongoose.model("Invitation", InvitationSchema, "Invitations");

module.exports = Invitation;
