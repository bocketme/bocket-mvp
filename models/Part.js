const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');

const configServer = require('../config/server');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const Organization = require('./Organization');
const PartFileSystem = require('../config/PartFileSystem');

function createPartFilSystem(chemin, cb) {
    let promises = [];
    Object.values(PartFileSystem).forEach(lastPath => {
        promises.push(new Promise((resolve, reject) => {
            fs.mkdir(path.join(chemin, lastPath), (err) => {
                if(err)
                    reject(err);
                resolve;
            })
        }));
    });
    return cb(promises);
}

let NestedOrganization = mongoose.Schema({
    _id: {type:  mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let PartSchema = mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, default: "No description aviable"},

    path: String,
    maturity: {type: String, default: TypeEnum.maturity[0]},
    ownerOrganization: {type: NestedOrganization, require: true},
    quality: {type: Number, default:0},
    tags: {type: [], default: []},
    annotation: {type: [NestedAnnotation], default: []},
    activities : {type: [NestedComment], default: []}

    //owners: {type: [nestedOwners], default: []}
});

PartSchema.pre('validate', (part, next) => {
    if(!part.path) {
        part.path = '/' + part.ownerOrganization.name + '/' + part.name + ' - ' + part._id;
        let partPath = path.join(configServer.files3D, part.path);
        fs.access(partPath, err => {
            if (!err)
                return next();
            fs.mkdir(partPath, (err)=> {
                if (err)
                    return next(err);
                createPartFilSystem(partPath, (promises) => {
                    Promise.all(promises)
                        .then(() => {
                            return next();
                        });
                });
            })
        })
    }
    return next();
});

PartSchema.statics.newDocument = (partInformation) => {
    return new Part(partInformation);
};

PartSchema.plugin(uniqueValidator);

let Part = mongoose.model("Part", PartSchema, "Parts");

module.exports = Part;