const organizationSchema = require('../../models/Organization');
const log = require('../../utils/log');

module.exports = (io, socket) => {
  socket.on('[Organization] - removed', async (organizationId) => {
    try {
      const organization = await organizationSchema.findById(organizationId);
      if (organization) throw new Error('[Organization] - The organizaiton exist');
      io.to(organizationId).emit('[Organization] - removed')
    } catch (error) {
      log.error(error)
    }
  });
};
