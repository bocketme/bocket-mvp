const express = require("express");
const config = require("./config/server"); // SERVER CONFIGURATION
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NODEJS DEBUGGER
const Promise = require("promise");
const twig = require('twig');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const helmet = require('helmet');
const csurf = require('csurf');
const Keygrip = require('keygrip');
const cookies = require('cookies');
const FSconfig = require('./config/FileSystemConfig');
const log = require('./utils/log');
const sharedsession = require('express-socket.io-session');

/* ROUTES */
const index = require("./routes/index");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const signOut = require("./routes/signOut");
const project = require("./routes/project");
const user = require("./routes/user");
const part = require("./routes/part");
const assembly = require("./routes/assembly");

/* SESSION */
const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession); //session store

const session = expressSession({
    secret: config.secretSession,
    store: new MongoStore({ url: config.mongoDB }),
    resave: false,
    saveUninitialized: true
});

/* Start The Express Server */
const app = express();
app.use(session);

/* Start The HTTP Server */
const server = require('http').createServer(app);
const io = require("socket.io")(server);
io.use(sharedsession(session, {
    autoSave: false,
}));
const ioListener = require("./sockets/socketsListener")(io);

const ioFileManager = require("socket.io")(server, {
  path: '/file'
});

//Initialize the favicon
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon-bocket.png')));

//configure and verify the server
try {
    server.listen(config.port);
}
catch (e) {
    log.error("Unable to bind on port : " + config.port);
}

mongoose.Promise = Promise;
//Set up default mongoose connection
let mongoDB = config.mongoDB;
mongoose.connect(mongoDB);

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));

module.exports = app;

// for parsing application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/*
//Use helmet to secure the headers.
app.use(helmet());

//Use csurg against CSRF fails
app.use(csurf());

app.use(function (req, res, next) {
  res.locals._csrf = req.csrfToken();
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
*/

// Display body request
/*app.use(function (req, res, next) {
    log.info("You posted:\n" + JSON.stringify(req.body, null, 2));
    next();
});*/

//TODO: Make an middleware which escape HTML characters for req.body & req.params
//TODO: Make an middleware which check if user have permissions
//TODO: Only char & number in workspace, no special char

app.engine('twig', require('twig').__express);
app.set("view engine", "twig");
app.set('twig options', {
    strict_variables: false,
});
app.use(express.static('public'));
app.use("/signOut", signOut);
app.use("/", index);
app.use("/user", user);
app.use("/signin", signin);
app.use("/signup", signup);
app.use("/project", project);
app.use("/part", part);
app.use("/assembly", assembly);

// TODO: Bouton "connectez vous" ne fonctionne pas
server.on("listening", () => {
    for (let dir in FSconfig.appDirectory) {
        fs.access(FSconfig.appDirectory[dir], err => {
            if (err) {
                log.error(err);
                fs.mkdir(FSconfig.appDirectory[dir], (err) => {
                    if (err)
                        return log.fatal(err);
                    log.info(`Directory ${dir} ==> ok`);
                });
            } else log.info(`Directory ${dir} ==> ok`);
        });
    }
});
