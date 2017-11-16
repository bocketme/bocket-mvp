let mongoose = require("mongoose");

let NestedOrganizationSchema = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, required: true},
    name: {type: String, required: true},
    end : {type: Date}
});

module.exports = NestedOrganizationSchema;