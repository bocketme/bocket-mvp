const userSchema = require('../../models/User');
const nodeSchema = require('../../models/Node');
const AppError = require('../../utils/error/customAppError');
const log = require('../../utils/log');

function throwInternError (err) {
  log.error('[User] - Does not have the right \n', err);
  throw new AppError(`Intern Error`, 500);
}

/**
 * Check if the user can delete the node
 * @param email {string}
 * @param nodeId {string}
 * @return {Promise<void>}
 */
async function doesHeHaveRights(email, nodeId) {
  const user = await userSchema.find({ email }).catch(throwInternError);

  if (!user) return null;

  const query = nodeSchema.findById(nodeId).or([{
    'team.members': user._id,
    'team.owners': user._id,
  }]);

  const node = await query.exec().catch(throwInternError);

  if (!node) throw new AppError('[User] - The user has no rights for this node');
  else return null;
}

module.exports = doesHeHaveRights;