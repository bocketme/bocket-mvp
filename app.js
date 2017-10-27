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
let app = express();

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

app.listen(config.port, () => {

});
