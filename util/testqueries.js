connection = require('../database/index');

connection.query("INSERT INTO node SET ?", {
    name: "akka",
    state_of_maturity: 0,
    node_parent: 1,
    id_project: 1,
    id_files3d: 10,
    id_branch: 1
}, (err, result, fields) => {
    if (err) {
        return (err);
    } else {
        return (result.insertId);
    }
});