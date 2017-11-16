let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

let User = new mongoose.Schema({
    completeName: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},    
});

let Node = new mongoose.Schema({
    name: {type: String, required: true}
});

let OrganizationSchema = new mongoose.Schema({
    owner : {type: [User], require: true },
    member : [User],
    // adresse : String,
    name: {type: String, require: true , index: { unique: true }},
    node: [Node]
});

let Organization = mongoose.model("Organization", OrganizationSchema, "Organizations");

module.exports = Organization;