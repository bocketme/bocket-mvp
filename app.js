/**
 * Created by jean-adriendomage on 26/10/2017.
 */

const express = require("express");
const index = require("./routes/index");
const signin = require("./routes/signin");
const signup = require("./routes/signup");
const config = require("./config/server");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const isEmail = require('isemail');
const BetaEmail = require("./models/BetaEmail");

let app = express();
let server = require('http').createServer(app);
let io = require("socket.io")(server);

const MongoClient = require('mongodb').MongoClient;
let uri = "mongodb://localhost/bocketmedev";
let database = null;
const BetaEmailRepository = require("./mongoRepositories/BetaEmailRepository");
let betaEmailRepository = null;


MongoClient.connect(uri, function(err, db) {
    if (err)
        throw err;
    database = db;

    betaEmailRepository = new BetaEmailRepository(db);

    server.listen(config.port, () => {});
    console.log("Connection to mongodb succed ");
});


app.use(morgan('dev'));

module.exports = app;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("view engine", "twig");

app.use("/", index);
app.use("/signin", signin);
app.use("/signup", signup);

app.use(express.static('public'));

io.on("connection", (socket) => {
    socket.on("a", () => {
        console.log("Bonjour");
    })
    socket.on("betaRegistration", (email) => {
        console.log("J'ai reçu : " , email);
        internalError = {
            title: "Internal error !",
            desc: "Please, try again."
        };
        emailError = {
            title: "Invalid email !",
            desc: internalError.desc
        }
        sucess = {
            title: "Thank you for your interest !",
            desc: "We will keep you in touch very soon Enjoy your day :)"
        };

        if (isEmail.validate(email) === false) {
            console.log("email invalid");
            socket.emit("betaRegistration", emailError);
            return ;
        }
        betaEmail = new BetaEmail(email);
        betaEmailRepository.find(betaEmail)
            .then(result => {
                console.log(result);
                if (result !== null) {
                    socket.emit("betaRegistration", sucess);
                    return ;
                }
                betaEmailRepository.add(betaEmail)
                    .then(() => {
                        socket.emit("betaRegistration", sucess);
                    })
            })
            .catch(() => {
                socket.emit("betaRegistration", internalError);
            })
    });
})
