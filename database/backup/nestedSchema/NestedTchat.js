const mongoose = require('mongoose');

const NestedTchat = mongoose.Schema({
    title: String,
    messages: [],
    users: []
});

module.exports = NestedTchat;