let mongoose = require("mongoose");

let NestWorkspaceSchema = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, required: true},
    name : {type: String, required: true},
});

module.exports = NestWorkspaceSchema;
