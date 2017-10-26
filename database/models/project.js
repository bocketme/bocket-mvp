const mysqlModel = require('mysql-model'),
    dbconfig = require('../database_config.json');

let ProjectModel = mysqlModel.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    database: dbconfig.database,
    password: dbconfig.password,
    port: dbconfig.port,
});

let Project = ProjectModel.extend({
    tablename: "user"
});

let project = new Project();