const express = require("express");
const config = require("./config/server"); // SERVER CONFIGURATION
const bodyParser = require('body-parser');
const morgan = require('morgan'); // NODEJS DEBUGGER
const Promise = require("promise");
// const cookieParser = require("cookie-parser");

/* ROUTES */
const index = require("./routes/index");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const project = require("./routes/project");
const node = require("./routes/node");

let app = express();
let server = require('http').createServer(app);
let io = require("socket.io")(server);
let ioListener = require("./sockets/socketsListener")(io);

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
// app.use(function (req, res) {
//     res.setHeader('Content-Type', 'text/plain');
//     res.write('you posted:\n');
//     res.end(JSON.stringify(req.body, null, 2))
// });

app.set("view engine", "twig");

app.use("/", index);

app.use("/signin", signin);
app.use("/signup", signup);
app.use("/project", project);
app.use("/node", node);

app.use(express.static('public'));