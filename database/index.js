const mysql = require('mysql'),
    dbconfig = require('../database_config.json');

let connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    port: dbconfig.port,
    database: dbconfig.database,
    checkExpirationInterval: 90000000, // How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000, // The maximum age of a valid session; milliseconds.
    createDatabaseTable: true, // Whether or not to create the sessions database table, if one does not already exist.
    connectionLimit: 1, // Number of connections when creating a connection pool
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});


connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('[DATABASE] -> Connected to database ' + dbconfig.database);
    }
});

module.exports = connection;