const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const NestedFile = require("./NestedFile");

let activity = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, default: mongoose.Types.ObjectId()},
    type: {type: String, required: true},
    content: { type: String, required: true },
    date: { type: Date, default: new Date() },
    author: {type: String, required: true },
    files: {type: [NestedFile], default:[]},
    comments: {type: [this], default: []}
});

activity.plugin(uniqueValidator);

module.exports = activity;