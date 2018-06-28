const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NestedTchat = mongoose.Schema({
    title: String,
    messages: [],
    users: []
});

module.exports = NestedTchat;