const express = require('express');
const fs = require('fs');
const httpsUrl = 'https://bocket.me';
const letsencryptPath = '/etc/letsencrypt/live/bocket.me';

/* Redirection of http request to http + tls */

const appRedirect = express();
/*
appRedirect.get('/', (req, res) => {
   res.redirect(httpsUrl);
});
*/
appRedirect.all('/', (req, res) => {
    res.redirect(httpsUrl);
});

const redirectServer = require('http').createServer(appRedirect);
redirectServer.listen(80);

/* start https server */

const options = {
    key : fs.readFileSync(`${letsencryptPath}/privkey.pem`),
    cert: fs.readFileSync(`${letsencryptPath}/cert.pem`),
    ca : fs.readFileSync(`${letsencryptPath}/chain.pem`)
};

module.exports = app => {
    return require('https').createServer(options, app);
};
