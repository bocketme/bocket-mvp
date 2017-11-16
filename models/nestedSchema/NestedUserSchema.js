let mongoose = require("mongoose");

let NestedUserSchema = new mongoose.Schema({
    completeName: {type: String, required: true},
    email: {type: String, required: true},
});

module.exports = NestedUserSchema;
