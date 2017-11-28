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

/* SESSION */
let session = require("express-session");
const MongoStore = require('connect-mongo')(session); //session store

let app = express();
let server = require('http').createServer(app);
let io = require("socket.io")(server);
let ioListener = require("./sockets/socketsListener")(io);

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

app.use(session({
    secret: config.secretSession,
    store: new MongoStore({ url: config.mongoDB}),
    resave: false,
    saveUninitialized: false
}));

// Add the session in sockets (deprecated)
/*io.use(function(socket, next) {
    //console.log(socket);
    session(socket.request, socket.request.res, next);
});*/

module.exports = app;

// for parsing application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse the cookies of the application
// app.use(cookieParser);

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

app.use("/signin", signin);
app.use("/signup", signup);
app.use("/project", project);
app.use("/node", node);
app.use("/workspace", workspace);
app.post("/test", (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send(req.query);
})

app.use(express.static('public'));

// TODO: Bouton "connectez vous" ne fonctionne pas
server.on("listening", () => {
    fs.access(config.avatar, (err) => {
        if (err){
            logError(err, "avatar", config.avatar);
        }
    });
    fs.access(config.gitfiles, (err) => {
        if (err){
            logError(err, "bocket", config.gitfiles)
        }
    });
    fs.access(config.specfiles, (err) => {
        if (err){
            logError(err, "spec", config.specfiles)
        }
    })
});

function logError(err, name, path){
    if(err.errno== -4058)
    console.log("Create the directory "+ name +" in" + path);
    else console.log(err);
}
