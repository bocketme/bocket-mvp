let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');


let NestedUserSchema = new mongoose.Schema({
    completeName: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},
});

NestedUserSchema.plugin(uniqueValidator);

module.exports = NestedUserSchema;
