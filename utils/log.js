const pino = require('pino');
const childProcess = require('child_process');
const stream = require('stream');

// Environment variables
const cwd = process.cwd();
const {env} = process;
const logPath = `${cwd}/log`;
console.log(logPath)
// Create a stream where the logs will be written
const logThrough = new stream.PassThrough();
const log = pino({name: 'bocket'}, logThrough);

// Log to multiple files using a separate process
const child = childProcess.spawn(process.execPath, [
  require.resolve('pino-tee'),
  'warn', `${logPath}/warn.log`,
  'error', `${logPath}/error.log`,
  'fatal', `${logPath}/fatal.log`
], {cwd, env});

logThrough.pipe(child.stdin);

// Log pretty messages to console (optional, for development purposes only)
const pretty = pino.pretty();
pretty.pipe(process.stdout);
logThrough.pipe(pretty);

module.exports = log;
