const mysqlModel = require('mysql-model'),
    dbconfig = require('../database_config.json');

let UserModel = mysqlModel.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    database: dbconfig.database,
    password: dbconfig.password,
    port: dbconfig.port,
});

let User = UserModel.extend({
    tablename: "user"
});

let user = new User();