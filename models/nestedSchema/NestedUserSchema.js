let mongoose = require("mongoose");

let NestedUserSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    completeName: {type: String, required: true},
    email: {type: String, required: true},
});

module.exports = NestedUserSchema;
