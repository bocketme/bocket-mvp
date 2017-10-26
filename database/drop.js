const mysql = require('mysql'),
    dbconfig = require('../database_config.json');

let connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    port: dbconfig.port,
});


connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('[DATABASE] -> Connected to database ' + dbconfig.database);
        connection.query('DROP TABLE IF EXISTS branch, comments, filesmtl, filesobj, node, notifications, project, specfile, team, user, rights;', (err) => {
            if (err) throw err;
            console.log('[DATABASE] -> Droped tables ');
            process.exit(1);
        });
    }
});