let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
let uid = require("uid-safe");

let nestedPeopleSchema = mongoose.Schema({
    completeName : String,
    email: {type : String, required: true}
});

let InvitationSchema = mongoose.Schema({
    uid: { type: String, default: "" },
    workspaceId : {type: String, required: true},
    people : {type : [nestedPeopleSchema], default: []}
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

nestedPeopleSchema.plugin(uniqueValidator);
InvitationSchema.plugin(uniqueValidator);

let Invitation = mongoose.model("Invitation", InvitationSchema, "Invitations");

module.exports = Invitation;
