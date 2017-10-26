let connection = require('../../../database/index'),
    control = new Object();

control.notMasterBranch = (req, res) => {
    let id_branch = req.params.branch;
    connection.query("SELECT name FROM branch WHERE id = ? ", [id_branch], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error : ".concat(err))).end();
        else if (!results)
            res.status(404).send("Branch not Found").end();
        else if (results[0].name === 'master')
            res.status(500).send("REQUEST ERROR : IMPOSSIBLE TO DELETE THE BRANCH MASTER").end();
        else
            next();
    });
};

control.verif = {};

control.verif.write_fileByNode = (req, res, next) => {
    let username = req.body.username,
        password = req.body.password,
        id_node = req.params.nodeId;

    connection.query("SELECT SELECT rights_file.write_right FROM rights_file, node, user, affectation WHERE (user.username = ?) AND (user.password = ?) AND (user.id = affectation.id_user) AND (rights_file.id_affectation = affectation.id) AND (rights_file.id_node = node.id) AND (node.id = ?);", [username, password, id_node], (err, results, fields) => {
        if (err)
            res.status(500).send(new Error("Intern Error : ".concat(err))).end();
        else if (!results)
            res.status(404).send("Branch Not Found").end();
        else if (results[0].write_file == true)
            res.status(500).send("REQUEST ERROR : IMPOSSIBLE TO DELETE THE BRANCH MASTER").end();
        else
            next();
    });
};

control.verif.read_fileByNode = (req, res, next) => {};

control.verif.projectPermissionByUser = (req, res, next) => {};

control.verif.rights_administrationByUser = (req, res, next) => {};

module.exports = control;