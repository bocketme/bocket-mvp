const nodeSchema = require('../../models/Node');
let TypeEnum = require('../../enum/NodeTypeEnum');
let twig = require('twig');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on("nodeChildren", async (nodeId, breadcrumbs, sub_level) => {
    try {
      const node = await nodeSchema.findById(nodeId);
      const _node = node.toObject();
      const childrenId = _node.children.map(({ _id }) => nodeSchema.findById(_id))
      const children = [...await Promise.all(childrenId)].map(child => Object.assign({ title: child.name, breadcrumb: `${breadcrumbs}/${child.name}` }, child.toObject()));
      sub_level++;

      twig.renderFile('./views/socket/three_child.twig', {
        node: { children },
        TypeEnum,
        sub_level
      }, (err, html) => {
        if (err) {
          log.error('[Socket] - node Children\n', err);
          socket.emit("error", err);
        }
        else socket.emit("nodeChild", html, nodeId);
      });
    } catch (err) {
      log.error(err);
    }
  })
};
