let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

let Organization = require("./nestedSchema/NestedOrganizationSchema");
let NestedUser  = require("./nestedSchema/NestedUserSchema");
let NestedNode = require("./nestedSchema/NestedNodeSchema");
let Node = require("./Node");

let Stripe = new mongoose.Schema({
    name: String
});

let TeamSchema = new mongoose.Schema({
    owners: {type: [NestedUser], required: true, default: []},
    members: {type: [NestedUser], required: false, default: []},
    consults: {type: [NestedUser], required: false, default: []},
    invited: {type: String, required: false, default: []},
    createDate: { type:Date, default: new Date() },
});


TeamSchema.statics.newDocument = (teamInformation) => {
    return new Team(teamInformation);
};

let Team = mongoose.model("Team", TeamSchema, "Teams");

module.exports = Team;