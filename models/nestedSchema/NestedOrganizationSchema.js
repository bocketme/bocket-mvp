let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');

let NestedOrganizationSchema = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, required: true},
    name: {type: String, required: true, index: { unique: true }},
    end : {type: Date}
});

NestedOrganizationSchema.plugin(uniqueValidator);

module.exports = NestedOrganizationSchema;