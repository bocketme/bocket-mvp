const express = require("express");
const config = require("./config/server"); // SERVER CONFIGURATION
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NODEJS DEBUGGER
const Promise = require("promise");
// const cookieParser = require("cookie-parser");
const twig = require('twig');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');

/* ROUTES */
const index = require("./routes/index");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const project = require("./routes/project");
const node = require("./routes/node");
const workspace = require("./routes/workspace");
const user = require("./routes/user");
const part = require("./routes/part");
const assembly = require("./routes/assembly");

/* SESSION */
let expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession); //session store
let session = expressSession({
    secret: config.secretSession,
    store: new MongoStore({ url: config.mongoDB}),
    resave: true,
    saveUninitialized: true
});
let sharedsession = require("express-socket.io-session");

let app = express();
let server = require('http').createServer(app);
let io = require("socket.io")(server);
let ioListener = require("./sockets/socketsListener")(io);
// // parse the cookies of the application
// app.use(cookieParser);

//Initialize the favicon
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon-bocket.png')));

//configure and verify the server
server.listen(config.port);

//Import the mongoose module
let mongoose = require('mongoose');
mongoose.Promise = Promise;
//Set up default mongoose connection
let mongoDB = config.mongoDB;
mongoose.connect(mongoDB, {
    useMongoClient: true
});

//Get the default connection
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));

app.use(session);
io.use(sharedsession(session, {
    autoSave: true
}));

module.exports = app;

// for parsing application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Display body request
/*app.use(function (req, res, next) {
    console.log("You posted:\n" + JSON.stringify(req.body, null, 2));
    next();
});*/

//TODO: Make an middleware which escape HTML characters for req.body & req.params
//TODO: Make an middleware which check if user have permissions

app.engine('twig', require('twig').__express);
app.set("view engine", "twig");
app.set('twig options', {
    strict_variables: false,
});

app.use("/", index);

app.use("/user", user);
app.use("/signin", signin);
app.use("/signup", signup);
app.use("/project", project);
app.use("/node", node);
app.use("/workspace", workspace);
app.use("/part", part);
app.use("/assembly", assembly);
app.post("/test", (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send(req.query);
});

app.use(express.static('public'));

// TODO: Bouton "connectez vous" ne fonctionne pas
server.on("listening", () => {
    var filesToVerify =
        [{name: 'avatar', path: config.avatar},
            {name: 'bocket', path: config.gitfiles},
            {name: 'tpm', path: config.tpm},
            {name: 'spec', path: config.specfiles}];
    verifyAccess(filesToVerify);
});

function verifyAccess(params){
    for (var i = 0; i< params.length; i++ ) {
        fs.access(params[i].path, logError(params[i]))
    }
}

function logError(content){
    return (err) => {
        if (err){
            if(err.errno== -4058)
                console.log("Create the directory "+ content.name +" in" + content.path);
        }
    }
}
