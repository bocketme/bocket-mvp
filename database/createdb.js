const mysql = require('mysql'),
    dbconfig = require('../database_config.json'),
    connection = require('./index');

connection.query('CREATE DATABASE ' + dbconfig.database, (err) => {
    if (err) throw err;
    console.log('[DATABASE] -> Created database ' + dbconfig.database);
});