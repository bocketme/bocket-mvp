const express = require("express");
const config = require("./config/server"); // SERVER CONFIGURATION
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NODEJS DEBUGGER
const Promise = require("promise");
// const cookieParser = require("cookie-parser");
const twig = require('twig');

/* ROUTES */
const index = require("./routes/index");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const project = require("./routes/project");
const node = require("./routes/node");
const workspace = require("./routes/workspace");

let app = express();
let server = require('http').createServer(app);
let io = require("socket.io")(server);
let ioListener = require("./sockets/socketsListener")(io);

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

module.exports = app;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse the cookies of the application
// app.use(cookieParser);

// parse application/json
app.use(bodyParser.json());


// Display body request
app.use(function (req, res, next) {
    //console.log("You posted:\n" + JSON.stringify(req.body, null, 2))
    next();
});

app.engine('twig', require('twig').__express);
app.set("view engine", "twig");
app.set('twig options', { 
    strict_variables: false,
});

app.use("/", index);
//app.use("/signin", signin);
//app.use("/signup", signup);
//app.use("/project", project);
//app.use("/node", node);
//app.use("/workspace", workspace);

app.use(express.static('public'));