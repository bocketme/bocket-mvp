const mongoose = require('mongoose');

let nestedAnnotation = mongoose.Schema({
    title: String,
    data: String,
    position: [],
});

module.exports = nestedAnnotation;