const Invitation = require('../models/Invitation');
const getPathToSpec = require('../utils/node/getPathToSpec');
const path = require('path');
const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.readFile);

const indexController = {

  index(req, res) {
    return res.render('index', {
    });
  },
  invitation: (req, res) => {
    Invitation.findOne({ uid: req.params.invitationUid })
        .then((i) => {
          console.log(i);
          if (!i || i === null) res.redirect('/');
          return res.render('index', {
            invitation: true,
            invitationUid: req.params.invitationUid,
            workspaceName: i.workspace.name,
            completeName: i.people.completeName,
          });
        })
        .catch(() => res.send('Internal server error', 500));
  },
  download: (req, res) => {
    const { nodeId, filename } = req.params;
    getPathToSpec(nodeId, req.session.currentWorkspace)
        .then((p) => {
          p = path.join(path.resolve(p), filename);
          read(path.join(p))
              .then(() => res.download(p))
              .catch(() => res.status(405).send('File not found'));
        })
        .catch((err) => {
          console.log('Error', err);
        });
  },
};

module.exports = indexController;
