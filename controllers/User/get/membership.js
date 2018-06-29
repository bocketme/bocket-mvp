const userSchema = require('../../../models/User');
const httpErrors = require("http-errors");
const log = require('../../../utils/log');
module.exports = async (req, res, next) => {
  try {
    const user = await userSchema
      .findById(req.session.userId)
      .populate("Manager Manager.Workspaces Manager.Organization")
      .exec();

    if (!user) return next(httpErrors.NotFound('Cannot Found The User'));

    const options = {
      Manager: user.Manager
    };

    return res.render('./socket/NonAccess.twig', options);
  } catch (err) {
    log.error(err);
    return next(httpErrors.InternalServerError())
  }
};
