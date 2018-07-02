const nodeSchema = require('../../models/Node');
const partSchema = require('../../models/Part');
const userSchema = require('../../models/User');
const assemblySchema = require('../../models/Assembly');
const fs = require('fs');
const path = require('path');

const NodeTypeEnum = require('../../enum/NodeTypeEnum');
const configServer = require('../../config/server');
const PartFileSystem = require('../../config/PartFileSystem');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('nodeInformation', async (nodeId) => {
    try {
      const node = await nodeSchema.findById(nodeId);
      let content, chemin;
      switch (node.type) {
        case NodeTypeEnum.assembly:
          content = await assemblySchema
            .findById(node.content)
            .populate('Organization', 'name');
          chemin = path.join(configServer.files3D, content.path);
          break;
        case NodeTypeEnum.part:
          content = await partSchema
            .findById(node.content)
            .populate('Organization', 'name');
          chemin = path.join(configServer.files3D, content.path);
          break;
        default:
          throw new Error("[Node] - Information : The node's type is not defined");
      }

      const creator = await userSchema.findById(content.creator);

      //Send the information Node
      socket.emit("[Node] - Details", {
        name: node.name,
        description: node.description,
        created: node.created,
        organization: content.Organization.name,
        creator: creator ? creator.completeName : "Information Not Available",
      });

      if(node.type === NodeTypeEnum.part){
        fs.readdir(path.join(chemin, PartFileSystem.data), {encoding: 'utf8'}, (err, files) => {
          if(err)
            log.error(err);
          else {
            files.forEach(file => {
              if (path.extname(file) !== '.json')
                socket.emit('addSpec', file, true);
            });
          }
        })
      }

      fs.readdir(path.join(chemin, PartFileSystem.spec), {encoding: 'utf8'}, (err, files) => {
        if(err)
          log.error(err);
        else
          files.forEach(file => socket.emit('addSpec', file, false));
      });
    } catch (e) {
      log.error(e);
    }
  });
};
