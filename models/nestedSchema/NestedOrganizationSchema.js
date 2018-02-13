let mongoose = require("mongoose");

let NestedOrganizationSchema = new mongoose.Schema({
    _id : {type : mongoose.SchemaTypes.ObjectId, required: true},
    name: {type: String, required: true},
    //TODO: Delete the end Date.
    //end : {type: Date}
});

module.exports = NestedOrganizationSchema;