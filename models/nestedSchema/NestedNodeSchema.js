let mongoose = require("mongoose");

let Node = new mongoose.Schema({
    _id: {type: String, require: true},
    title: {type: String, default: "My Bocket"},
    type: {type: String, default: "assembly"},
});

module.exports = Node;