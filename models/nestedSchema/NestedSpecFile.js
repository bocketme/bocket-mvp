const mongoose = require('mongoose');

let NestedSpecFiles = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, default: mongoose.Types.ObjectId()},
    name: {type: String, require: true},
    path: {type: String, require: true},
    created: {type: Date, default: new Date()},
    modified: {type: Date, default: new Date()}
});

module.exports = NestedSpecFiles;