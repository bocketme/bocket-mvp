let Organization = require("../models/Organization");

let controller = {
    get: (req, res) => {
        
    },
    post: (req, res) => {

    },
    initialize: (req, res) => {
        let newOrganization = new Organization({
            owner : {
                completeName: req.body.completeName,
                email : req.body.email
            },
            nom: req.body.completeName + "_organization",
            node: { name: "My Bocket" }
        })
    },
    update: (req, res) => [

    ]
}