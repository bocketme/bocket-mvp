let project = require('../models/project');
let Workspace = require("../models/Workspace");
let User = require("../models/User");
let Node = require("../models/Node");
let fs = require('fs');
let NodeTypeEnum = require("../enum/NodeTypeEnum");
let ViewTypeEnum = require("../enum/ViewTypeEnum");
let path = require('path');
module.exports = {
    /**
    * Affiche tous les projets d'un utilisateur
    * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
    */
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
        if (!req.body.email || !req.body.password || !req.body.workspaceId) {
            console.log("Nice try");
            res.redirect("/");
            return ;
        }
        if (!req.session.userMail) {
            User.findOne({email: req.body.email})
            .then(result => {
                result.comparePassword(req.body.password, (err, isMatch) => {
                    if (err) {
                        console.log("[projectController.indexPOST] :", err);
                        res.sendStatus(500);
                    }
                    else if (!isMatch) {
                        console.log("User n'est pas connecté !");
                        res.redirect("/signIn");
                    }
                    else {
                        req.session.userMail = result.email;
                        req.session.completeName = result.completeName;
                        req.session.currentWorkspace = req.body.workspaceId;
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
            req.session.currentWorkspace = req.body.workspaceId;
            res.redirect(req.originalUrl + "/" + req.body.workspaceId);
        }
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
                    console.log(user);
                    if (user !== null)
                    {
                        Node.findById(workspace.node_master._id)
                            .then(node_master => {
                                // console.log("NODE_MASTER = ", node_master);
                                let children = node_master.children.length !== 0;
                                let node = {name : node_master.name, _id: node_master._id, type: node_master.type, children: []};
                                let i = 0;
                                while (i < node_master.children.length)
                                {
                                    node.children.push({title: node_master.children[i].title, _id: node_master.children[i]._id, children: []});
                                    i += 1;
                                }
                                 console.log("NODES = ", node);

                                 fs.readFile('./test/test.obj',{encoding: 'utf8'},(err, doc) => {
                                    resolve({
                                        // workspaceId: workspaceId,
                                        title: workspace.name + ' - ' + title,
                                        in_use: {name: workspace.name, id: workspace._id},
                                        data_header: 'All Parts',
                                        user: user.completeName,
                                        nodeFile: doc,
                                        workspaces: user.workspaces,
                                        node: node,
                                        all_parts: 100,
                                        last_updates: 10,
                                        duplicates: 35,
                                        NodeTypeEnum: JSON.stringify(NodeTypeEnum), /* const for fronst end */
                                        ViewTypeEnum: JSON.stringify(ViewTypeEnum),
                                        userAvatar: user.avatar
                                    });
                                 })
                            })
                            .catch(err => {
                                console.log("[project controller] : error while finding node_master: ", err);
                                reject(500)
                            });
                    }
                    else
                    {
                        console.log("[projectController.indexPOST] : ", "User not found");
                        reject("/signin")
                    }
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
                console.log("[projectController.indexPOST] : ", "Workspace not found2", err);
                reject(404);
            }
            else {
                console.log("[projectController.indexPOST] : ", err);
                reject(500);
            }
        });
    });
}