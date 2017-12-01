let mongoose = require("mongoose");

let Node = new mongoose.Schema({
    _id: {type: String, required: true},
    title: {type: String, default: "My Bocket"},
});

module.exports = Node;