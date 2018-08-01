const { BadRequest, InternalServerError } = require('http-errors');
const { userVerification } = require('./utils');
const UserModel = require('../../../models/User');
const jwt = require('jsonwebtoken');
const { BACK_END } = require('../../../constants');
const log = require('../../../utils/log');

async function register(req, res, next) {
  try {
    const { completeName, email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword || !completeName)
      return next(BadRequest("[Sign Up] - Missing Information"));

    if (password !== confirmPassword)
      return next(BadRequest());

    try {
      userVerification(req.body);
    } catch (error) {
      log.error(error);
      return next(BadRequest("[Sign Up] - Cannot Pass the verification"));
    }

    const user = new UserModel({ email, password, completeName });
    try {
      await user.save();
    } catch (error) {
      log.error(error);
      return next(InternalServerError("[Sign Up] - User Cannot be saved in the database"))
    }

    const newUser = { completeName: user.completeName, email: user.email };

    const token = jwt.sign(newUser, BACK_END.secretKey, { audience: "const", expiresIn: "120" })

    res.cookie('jwt_user_auth', token);
    return res.status(200).send();
  } catch (error) {
    log.error(error);
    return next(InternalServerError("[Sign Up] - Intern Error"));
  }
}

module.exports = register;
