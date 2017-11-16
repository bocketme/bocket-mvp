let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');

let User = new mongoose.Schema({
    completeName: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},    
});

let Node = new mongoose.Schema({
    name: {type: String, required: true}
});

let OrganizationSchema = new mongoose.Schema({
    name: {type: String, required: true, index: { unique: true }},
    owner : {type: [User], require: true },
    member : [User],
    // adresse : String,
    node: [Node]
});

OrganizationSchema.plugin(uniqueValidator);

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;