const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const util = require('util');
const uniqueValidator = require('mongoose-unique-validator');

const configServer = require('../config/server');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const NestedAssembly = require("./nestedSchema/NestedAssemblySchema");
const PartFileSystem = require('../config/PartFileSystem');
const asyncForEach = require('./utils/asyncForeach');


let NestedOrganization = mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
    name: { type: String, require: true }
});

let PartSchema = mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, default: "No description aviable" },

    path: String,
    maturity: { type: String, default: TypeEnum.maturity[0] },
    ownerOrganization: { type: NestedOrganization, require: true },
    quality: { type: Number, default: 0 },
    tags: { type: [], default: [] },
    annotation: { type: [NestedAnnotation], default: [] },
    activities: { type: [NestedComment], default: [] }

    //owners: {type: [nestedOwners], default: []}
});
PartSchema.index ({ name: 'text', description: 'text' });

PartSchema.on("indexError", (error) => {
    console.error(error);
})

function mkdirPromise(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, (err) => {
            if (err)
                reject(err);
            else resolve();
        })
    })
}

PartSchema.pre('validate', function (next) {
    if (this.path)
        return next();

    this.path = '/' + this.ownerOrganization.name + '/' + this.name + ' - ' + this._id;
    let partPath = path.join(configServer.files3D, this.path);

    mkdirPromise(partPath)
    .then(() => {
        let promises = [];
        for (let directory in PartFileSystem) {
            promises.push(
                mkdirPromise(path.join(partPath, PartFileSystem[directory]))
            );
        }
        Promise.all(promises)
            .then(() => {
                return next()
            })
            .catch(err => {
                return next(err)
            });
    }).catch(err => {
        return next(err);
    });
});
PartSchema.statics.newDocument = (partInformation) => {
    return new Part(partInformation);
};

PartSchema.plugin(uniqueValidator);

let Part = mongoose.model("Part", PartSchema, "Parts");

module.exports = Part;