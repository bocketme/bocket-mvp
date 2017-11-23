let mongoose = require("mongoose");

let Node = new mongoose.Schema({
    title: { type: String },
    children: { type: [this]},
});

module.exports = Node;