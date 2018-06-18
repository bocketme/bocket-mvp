const userSchema = require('../../models/User');
const httpErrors = require("http-errors");
const { renderFile } = require('twig');

const memberShip = async (req, res, next) => {
  try {
    const user = await userSchema
      .findById(socket.handshake.session.userId)
      .populate("Manager Manager.Workspaces Manager.Organization")
      .execPopulate();

    if (!user) return next(httpErrors.NotFound('Cannot Found The User'));

    const options = {
      Manager: user.Manager
    }

    return res.render('./socket/NonAccess.twig', options);
  } catch (err) {
    return next(httpErrors.InternalServerError())
  }
};
