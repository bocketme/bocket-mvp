const { NodeModel } = require('../../../models');
const escape = require('escape-html');
const { NotFound, InternalServerError, } = require('http-errors');

module.exports = async function (req, res, next) {
  try {
    const { nodeId } = req.params;
    let { name, description } = req.body;

    const node = await NodeModel.findById(nodeId);

    if (!node)
      return next(NotFound())

    if (name && name.length < 40) {
      name = escape(name);
      node.name = name;
    }

    if (description && description.length < 160) {
      description = escape(description);
      node.description = description;
    }

    await node.save();
    return res.status(200).send();
  } catch (error) {
    log.error(error)
    return next(InternalServerError());
  }
}
