const mongoose = require('mongoose');

const nestedAnnotation = mongoose.Schema({
  title: String,
  data: String,
  position: [],
});

module.exports = nestedAnnotation;
