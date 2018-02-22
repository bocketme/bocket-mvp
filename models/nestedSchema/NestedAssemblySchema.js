let mongoose = require("mongoose");
let NestedUser = require("./NestedUserSchema")

let NestedAssemblySchema = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, required: true},
    name : {type: String, required: true},
});

module.exports = NestedAssemblySchema;
