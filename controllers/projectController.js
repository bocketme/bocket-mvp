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
        Workspace.findById({_id: req.params.workspaceId})
            .then(workspace => {
                if (workspace !== null)
                {
                    User.findOne({email: req.session.userMail})
                        .then(user => {
                            if (user !== null)
                            {
                                res.render('hub.twig', {
                                    title: workspace.name + ' - All Parts',
                                    in_use: workspace.name,
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
                                res.redirect("/");
                        })
                        .catch(err => {
                            console.log("[projectController.indexPOST] :", err);
                            res.sendStatus(500);
                        });
                }
                else
                    res.redirect("/");
            })
            .catch(err => {
                if (err.name == "CastError") // Workspace not found
                    res.sendStatus(404);
                else {
                    console.log(err);
                    res.sendStatus(500);
                }
            });
    },
    indexPOST: (req, res) => { //email, password & workspaceId
        // TODO: CHECK SI L'UTILISATEUR EST CONNECTEE ET A LE DROIT D'AVOIR ACCES A CE WSP
        if (!req.body.email || !req.body.password || !req.body.workspaceId) {
            console.log("Nice try");
            res.redirect("/");
            return ;
        }
        if (!req.session.userMail) {
            console.log("User n'a pas de session");
            User.findOne({email: req.body.email})
                .then(result => {
                    result.comparePassword(req.body.password, (err, isMatch) => {
                        if (err) {
                            console.log("[projectController.indexPOST] :", err);
                            res.sendStatus(500);
                        }
                        else if (!isMatch) {
                            console.log("result not matches !");
                            res.redirect("/");
                        }
                        else {
                            req.session.userMail = result.email;
                            res.redirect(req.originalUrl + "/" + req.body.workspaceId);
                        }
                    });
                })
                .catch(err => {
                    console.log("[projectController.indexPOST] : ", err);
                });
        }
        else {
            console.log("User a une session");
            res.redirect(req.originalUrl + "/" + req.body.workspaceId);
        }
    },

    last_updates: (req, res) => {
        res.render('hub.twig', {
            title: req.params.workspaceId + ' - Last Updates',
            in_use: req.params.workspaceId,
            data_header: 'Last Updates',            
            user: 'Alexis Dupont',
            workspaces: ['moi', 'je0', 'suis', 'beau'],
            node: JSON.stringify(require('../test/node.json')),
            all_parts: 100,
            last_updates: 10,
            duplicates: 35
        });
    },
    duplicates: (req, res) => {
        res.render('hub.twig', {
            title: req.params.workspaceId + ' - Duplicates',
            in_use:req.params.workspaceId,
            data_header: 'Duplicates',            
            user: 'Alexis Dupont',
            workspaces: ['moi', 'je0', 'suis', 'beau'],
            node: JSON.stringify(require('../test/node.json')),
            all_parts: 100,
            last_updates: 10,
            duplicates: 35
        });
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
