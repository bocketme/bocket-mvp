const Invitation = require('../models/Invitation');
const getPathToSpec = require('../utils/node/getPathToSpec');
const contentToNode = require('../utils/node/getContentOfNode');
const path = require('path');
const fs = require('fs');
const util = require('util');
const FSconfig = require('../config/FileSystemConfig');
const NodeTypeEnum = require('../enum/NodeTypeEnum');

const log = require('../utils/log');
const read = util.promisify(fs.readFile);

const indexController = {

  index(req, res) {
    return res.render('index', {
    });
  },
  invitation: (req, res) => {
    Invitation.findOne({ uid: req.params.invitationUid })
      .then((i) => {
        if (!i || i === null) res.redirect('/');
        return res.render('index', {
          invitation: true,
          invitationUid: req.params.invitationUid,
          completeName: i.people.completeName,
          email: i.people.email,
        });
      })
      .catch((err) => {
        log.error(err);
        res.status(500).send('Internal Error');
      });
  },
  download: (req, res) => {
    const { nodeId, filename } = req.params;
    getPathToSpec(nodeId, req.session.currentWorkspace)
      .then((p) => {
        p = path.join(path.resolve(p), filename);
        read(p)
          .then(() => res.download(p))
          .catch(() => res.status(405).send('File not found'));
      })
      .catch((err) => { log.error('Error', new Error(err) ); });
  },
  downloadNode: (req, res) => {
    const { nodeId, filename } = req.params;
    contentToNode(nodeId, req.session.currentWorkspace)
      .then(node => {
        if(node.type === NodeTypeEnum.assembly)
          throw ("ERROR, THERE IS NO 3D IN A ASSEMBLY");
        let p = path.join(FSconfig.appDirectory.files3D, node.content.path, FSconfig.content.data, filename);
        read(p)
          .then(() => res.download(p))
          .catch((err) => {
            log.error(err);
            res.status(405).send('File not found')
          });
      })
      .catch((err) => {
        log.error(err);
        res.status(405).send('File not found')
      });


  }
};

module.exports = indexController;
