let project = require('../models/project'),
    Workspace = require("../models/Workspace"),
    User = require("../models/User"),
    jwt = require('jsonwebtoken'),
    key = require('../utils/keys');

// ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT

module.exports = {
    /**
    * Affiche tous les projets d'un utilisateur
    * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
    */
    usejwt: (req, res, next) => {
        let data = {
            email: 'baba@bocket.me',
            username: 'baba'
        };
        let token = jwt.sign(data, key, { algorithm: 'HS256', expiresIn: 2, subject: 'user' },
        (err, token) => {
            if (err) {
                console.log(err);
                next();
            } else {
                res.cookie('jwt', token);
                next();
            }
        });
    },
    index: (req, res) => {
        getRenderInformation(req.params.workspaceId, req.session.userMail, "All Parts")
            .then(context => res.render("hub", context))
            .catch(err => {
                if (err === 404 || err === 500)
                    res.sendStatus(err);
                else
                    res.redirect(err);
            })
    },
    indexPOST: (req, res) => { //email, password & workspaceId
        // TODO: CHECK SI L'UTILISATEUR EST CONNECTEE ET A LE DROIT D'AVOIR ACCES A CE WSP
       
    },

    last_updates: (req, res) => {
        getRenderInformation(req.params.workspaceId, req.session.userMail, "Last Updates")
            .then(context => res.render("hub", context))
            .catch(err => {
                if (err == 400 || err == 500)
                    res.sendStatus(err);
                else
                    res.redirect(err);
            });
    },

    duplicates: (req, res) => {
        getRenderInformation(req.params.workspaceId, req.session.userMail, "Duplicates")
            .then(context => res.render("hub", context))
            .catch(err => {
                if (err === 400 || err === 500)
                    res.sendStatus(err);
                else
                    res.redirect(err);
            })
    },
    /**
    * Ajoute un projet à l'utilisateur X
    */
    add: (req, res) => {
        res.send();
    },
    /**
    * Modifie les données d'un projet
    * 1 - Vérifie les autorisations de l'utilisateur
    * 2 - Supprime le projet
    * 3 - Envoie une réponse 200
    * 2.1 - Envoie une réponse "Not Authorized"
    */
    update: (req, res) => { res.send() },
    /**
    * Supprime un projet :
    * 1 - Vérifie les autorisations de l'utilisateur
    * 2 - Supprime le projet
    * 3 - Envoie une réponse 200
    * 2.1 - Envoie une réponse "Not Authorized"
    */
    delete: (req, res) => {
        // project.findByIdAndRemove()
    }
}

function getRenderInformation(workspaceId, userMail, title) {
    console.log("getRenderInformation", workspaceId, userMail);
    return new Promise((resolve, reject) => {
        Workspace.findById({_id: workspaceId})
            .then(workspace => {
                if (workspace !== null)
                {
                    User.findOne({email: userMail})
                        .then(user => {
                            if (user !== null)
                            {
                                resolve({
                                    workspaceId: workspaceId,
                                    title: workspace.name + ' - ' + title,
                                    in_use: {name: workspace.name, id: workspace._id},
                                    data_header: 'All Parts',
                                    user: user.completeName,
                                    workspaces: user.workspaces,
                                    node: JSON.stringify(workspace.node_master),
                                    all_parts: 100,
                                    last_updates: 10,
                                    duplicates: 35
                                });
                            }
                            else
                                console.log("[projectController.indexPOST] : ", "User not found");
                                reject("/signin")
                        })
                        .catch(err => {
                            console.log("[projectController.indexPOST] :", err);
                            reject(500);
                        });
                }
                else {
                    console.log("[projectController.indexPOST] : ", "Workspace not found1");
                    reject(404);
                }
            })
            .catch(err => {
                if (err.name === "CastError") // Workspace not found
                {
                    console.log("[projectController.indexPOST] : ", "Workspace not found2");
                    reject(404);
                }
                else {
                    console.log("[projectController.indexPOST] : ", err);
                    reject(500);
                }
            });
    });
}