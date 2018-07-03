const express = require('express');
const config = require('./config/server'); // SERVER CONFIGURATION
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NODEJS DEBUGGER
const Promise = require('promise');
const twig = require('twig');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const FSconfig = require('./config/FileSystemConfig');
const log = require('./utils/log');
const sharedsession = require('express-socket.io-session');
const debug = require('debug')('bocketmvp:server');

/* ROUTES */
const index = require('./routes/index');
const node = require('./routes/node');
const signup = require('./routes/signup');
const signOut = require('./routes/signOut');
const user = require('./routes/user');
const part = require('./routes/part');
const assembly = require('./routes/assembly');
const organization = require('./routes/organization');
const workspace = require('./routes/workspaces');
/* SESSION */
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession); // session store

const session = expressSession({
  secret: config.secretSession,
  store: new MongoStore({ url: config.mongoDB }),
  resave: false,
  saveUninitialized: true,
});

/* Start The Express Server */
const app = express();
app.use(session);

/* Start The HTTP Server */
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.use(sharedsession(session, {
  autoSave: false,
}));

const ioListener = require('./sockets/socketsListener');

ioListener(io);

// Initialize the favicon
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon-bocket.png')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// configure and verify the server
try {
  server.listen(config.port);
} catch (e) {
  log.error(`Unable to bind on port : ${config.port}`);
}

mongoose.Promise = Promise;
// Set up default mongoose connection
mongoose.connect(config.mongoDB);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', log.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));

module.exports = app;

// for parsing application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/*
const helmet = require('helmet');
const csurf = require('csurf');
const Keygrip = require('keygrip');
const cookies = require('cookies');

//Use helmet to secure the headers.
app.use(helmet());

//Use csurg against CSRF fails
app.use(csurf());

app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Display body request
app.use(function (req, res, next) {
    log.info("You posted:\n" + JSON.stringify(req.body, null, 2));
    next();
});
*/

// TODO: Make an middleware which escape HTML characters for req.body & req.params
// TODO: Make an middleware which check if user have permissions
// TODO: Only char & number in workspace, no special char

app.engine('twig', twig.__express);
app.set('view engine', 'twig');
app.set('twig options', {
  strict_variables: false,
});
app.use(express.static('public'));
app.use('/workspace', workspace);
app.use('/user', user);
app.use('/signOut', signOut);
app.use('/', index);
app.use('/user', user);
app.use('/signup', signup);
app.use('/organization', organization);
app.use('/part', part);
app.use('/node', node);
app.use('/assembly', assembly);


// TODO: Bouton "connectez vous" ne fonctionne pas
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  log.info('Listening on ' + bind);

  for (const dir in FSconfig.appDirectory) {
    fs.access(FSconfig.appDirectory[dir], err => {
      if (err) {
        log.error(err);
        fs.mkdir(FSconfig.appDirectory[dir], (error) => {
          if (error)
            return log.fatal(error);
          return log.info(`Directory ${dir} ==> ok`);
        });
      } else log.info(`Directory ${dir} ==> ok`);
    });
  }
});
