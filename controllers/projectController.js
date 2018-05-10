let project = require('../models/project');
let Workspace = require('../models/Workspace');
let User = require('../models/User');
let Node = require('../models/Node');
let Organization = require('../models/Organization');
let fs = require('fs');
let NodeTypeEnum = require('../enum/NodeTypeEnum');
let ViewTypeEnum = require('../enum/ViewTypeEnum');
let path = require('path');
const log = require('../utils/log');

module.exports = {
  /**
   * Affiche tous les projets d'un utilisateur
   * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
   */
  index: (req, res) => {
    getRenderInformation(req.params.workspaceId, req.session.userMail)
      .then((context) => {
        req.session.currentWorkspace = req.params.workspaceId;
        res.render('hub', context);
      }).catch((err) => {
      log.error(err);
      if (err === 404 || err === 500) {
        res.sendStatus(err);
      } else {
        res.redirect(err);
      }
    });
  },
  indexPOST: (req, res) => { // email, password & workspaceId
    // TODO: CHECK SI L'UTILISATEUR EST CONNECTEE ET A LE DROIT D'AVOIR ACCES A CE WSP
    const {email, password, workspaceId} = req.body;

    connection(email, password)
      .then((user) => {
        req.session.userId = user._id;
        req.session.userMail = user.email;
        req.session.completeName = user.completeName;
        req.session.currentWorkspace = req.body.workspaceId;
        res.redirect(req.originalUrl + '/' + workspaceId);
      })
      .catch(err => {
        log.error('[projectController.indexPOST] : \n', err);
        res.redirect('/');
      });
  },
};

async function connection(email, password) {
  const user = await User.findOne({email});

  if (!user) throw 'User not Found';

  const isMatch = await user.comparePassword(password);

  if(!isMatch) throw 'Password incorrect';

  return {
    _id: user._id,
    email: user.email,
    completeName: user.completeName,
  }
}

async function getRenderInformation(workspaceId, email) {
  const workspace = await Workspace.findById(workspaceId).catch(errorDatabase);

  if (workspace === null) {
    log.warn('[Workspace Controller] - Workspace not Found');
    throw 404;
  }

  const user = await User.findOne({email})
    .populate('Organization._id', 'name')
    .populate('Organization.workspaces', 'name')
    .catch(errorDatabase);

  if(!user) {
    log.warn('[projectController.indexPOST] : User not found');
    reject('/signin');
  }

  const nodeMaster = await Node.findById(workspace.nodeMaster).catch(errorDatabase);

  const Organization = await user.Organization.find((orga) => {
    for(let i =0; i<orga.workspaces.length; i++){
      const workspace = orga.workspaces[i];
      if (String(workspace._id) === String(workspaceId)) return true;
    }
    return false;
  });

  return {
    title: workspace.name,
    in_use: {name: workspace.name, id: workspace._id},
    data_header: 'All Parts',
    user: user.completeName,
    workspaces: Organization.workspaces,
    node: nodeMaster,
    /* Const for front end */
    NodeTypeEnum: JSON.stringify(NodeTypeEnum),
    ViewTypeEnum: JSON.stringify(ViewTypeEnum),
  }
}

const errorDatabase = (err) => {
  log.error(err);
  throw 500;
};
