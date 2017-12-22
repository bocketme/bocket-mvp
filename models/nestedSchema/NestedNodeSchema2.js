let mongoose = require("mongoose");

let Node = new mongoose.Schema({
    _id: {type: String, require: true},
    name: {type: String, required: true},
    type: {type: String, default: "assembly"},
});

module.exports = Node;