const { BadRequest, InternalServerError } = require('http-errors');
const { userVerification } = require('./utils');
const UserModel = require('../../../models/User');

function authentification(req, res, next) {}

module.exports = authentification;
