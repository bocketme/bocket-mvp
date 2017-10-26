/**
 * Created by jean-adriendomage on 26/10/2017.
 */

const express = require("express");
const index = require("./routes/index");
const config = require("./config/server");
let app = express();

module.exports = app;

app.set("view engine", "twig");
app.use("/", index);

app.listen(config.port, () => {

});
