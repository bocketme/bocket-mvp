const add = require('./add');
const fetch = require('./fetch');
const remove = require('./remove');
const update = require('./update');

module.exports = (io, socket) => {
  add(io, socket);
  fetch(io, socket);
  remove(io, socket);
  update(io, socket);
};
