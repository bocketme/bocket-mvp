const nodeSchema = require('../../models/Node');
let TypeEnum = require('../../enum/NodeTypeEnum');
let twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on("nodeChildren", (nodeId, breadcrumbs, sub_level) => {
    nodeSchema.findById(nodeId)
      .then((node) => {
        node.children.forEach(child => {
          if (child.title)
            child.name = child.title;
          child.breadcrumb = breadcrumbs + '/' + child.name;
        });
        sub_level++;
        twig.renderFile('./views/socket/three_child.twig', {
          node: node,
          TypeEnum: TypeEnum,
          sub_level: sub_level
        }, (err, html) => {
          if (err) {
            log.error('[Socket] - node Children\n', err);
            socket.emit("error", err);
          }
          else socket.emit("nodeChild", html, nodeId);
        });
      });
  });
};
