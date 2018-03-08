let project = require('../models/project');
let Workspace = require("../models/Workspace");
let User = require("../models/User");
let Node = require("../models/Node");
let Organization = require('../models/Organization');
let fs = require('fs');
let NodeTypeEnum = require("../enum/NodeTypeEnum");
let ViewTypeEnum = require("../enum/ViewTypeEnum");
let path = require('path');
const log = require('../utils/log');

module.exports = {
  /**
   * Affiche tous les projets d'un utilisateur
   * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
   */
  index: (req, res) => {
    getRenderInformation(req.params.workspaceId, req.session.userMail)
      .then(context => {
        req.session.currentWorkspace = req.params.workspaceId;
        res.render("hub", context);
      })
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
      res.redirect("/");
      return ;
    }
    if (!req.session.userMail) {
      User.findOne({email: req.body.email})
        .then(result => {
          result.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              log.error("[projectController.indexPOST] :", err);
              res.sendStatus(500);
            }
            else if (!isMatch) {
              log.error("User n'est pas connecté !");
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
          log.error("[projectController.indexPOST] : ", err);
        });
    }
    else {
      req.session.currentWorkspace = req.body.workspaceId;
      res.redirect(req.originalUrl + "/" + req.body.workspaceId);
    }
  },
}

function getRenderInformation(workspaceId, userMail) {
  return new Promise((resolve, reject) => {
    Workspace.findById({_id: workspaceId})
      .then(workspace => {
        if (workspace === null) {
          log.warn("[projectController.indexPOST] : - Workspace not found")
          reject(404);
        }
        User.findOne({email: userMail})
          .then(user => {
            if (user === null) {
              log.warn("[projectController.indexPOST] : User not found")
              reject("/signin");
            }
          //  req.session.userId = user._id;
            Node.findById(workspace.node_master._id)
              .then(node_master => {
                let node = {name : node_master.name, _id: node_master._id, type: node_master.type, children: []};
                let i = 0;
                while (i < node_master.children.length)
                {
                  node.children.push({title: node_master.children[i].title, _id: node_master.children[i]._id, children: []});
                  i += 1;
                }
                Organization.find({"owner._id": user._id})
                .then((ownerOrganization) => {
                  resolve({
                    title: workspace.name,
                    in_use: {name: workspace.name, id: workspace._id},
                    data_header: 'All Parts',
                    user: user.completeName,
                    ownerOrganization: ownerOrganization,
                    workspaces: user.workspaces,
                    node: node,
                    all_parts: 100,
                    last_updates: 10,
                    duplicates: 35,
                    /* Const for front end */
                    NodeTypeEnum: JSON.stringify(NodeTypeEnum), 
                    ViewTypeEnum: JSON.stringify(ViewTypeEnum),
                  });
                });
              })
              .catch(err => {
                log.error("[project controller] : error while finding node_master \n", err);
                reject(500);
              });
          })
          .catch(err => {
            log.error("[project controller] : the Workspace while finding node_master \n", err);
            reject(500);
          });
      });
  });
}