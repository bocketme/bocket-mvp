const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout);
const log = pino({
  name: 'app',
  safe: true,
}, pretty);

module.exports = log;