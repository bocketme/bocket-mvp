let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');

let nestedPeopleSchema = mongoose.Schema({
    completeName : String,
    email: {type : String, require: true}
});

let InvitationSchema = mongoose.Schema({
    uid: {type: String, require: true},
    workspaceId : {type: String, require: true},
    people : {type : [nestedPeopleSchema], default: []}
});

nestedPeopleSchema.plugin(uniqueValidator);
InvitationSchema.plugin(uniqueValidator);

InvitationSchema.statics.createInvitation = (workspaceId, people) => {

};

let Invitation = mongoose.model("Invitation", InvitationSchema, "Invitations");

module.exports = Invitation;
