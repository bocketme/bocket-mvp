const connection = require('../database/index');

var rightsfile = {
    /**
     * write verification for a node
     */
    write_verification: (req, res, next) => {
        var id_user = req.sessions.id,
            id_node = req.params.node;

        connection.query("SELECT write_right from right_file WHERE id_node = ? AND id_affectation = (SELECT id FROM affectation WHERE id_user = ?);", [id_node, id_user],
            (err, result, fields) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(500).send("Intern Error");
                } else if (result.length === 0) {
                    res.status(401).send("You do not have the necessary rights for this operation");
                } else {
                    if (result.write_right == false)
                        res.status(401).send("You do not have the necessary rights for this operation");
                    else next();
                }
            });
    },
    /**
     * read verification for a node
     */
    read_verification: (req, res, next) => {
        var id_user = req.sessions.id,
            id_node = req.params.node;
        connection.query("SELECT right_file.read_right from right_file,  WHERE right_file.id_node = ? AND right_file.id_affectation = ?", [id_node, id_user],
            (err, result, fields) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(500).send("Intern Error");
                } else if (result.length === 0) {
                    res.status(401).send("Incorrect parmeters");
                } else {
                    if (result == false)
                        res.status(401).send("You do not have the necessary rights for this operation");
                    else next();
                }
            });
    },
    /**
     * write or read verification for a node
     */
    write_or_read_verification: (req, res, next) => {
        var id_user = req.sessions.id,
            id_node = req.params.node;
        connection.query("SELECT read_right, write_right from right_file WHERE id_node = ? AND id_affectation = (SELECT id FROM affectation WHERE id_user = ?);", [id_node, id_user],
            (err, result, fields) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(500).send("Intern Error");
                } else if (result.length === 0) {
                    res.status(401).send("Incorrect parmeters");
                } else {
                    if (result.read_right == false && result.write_right == false)
                        res.status(401).send("You do not have the necessary rights for this operation");
                    else next();
                }
            });
    },
    /**
     * Recuperate all the affectation_id for a node
     */
    get_by_node: (req, res) => {
        id_node = req.params.node;

        connection.query("SELECT id_affectation in right_file where id_node = ?", [id_node], (err, result, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else if (result.length === 0) {
                res.status(401).send("Incorrect Parameters");
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send(JSON.stringify(result));
            }
        });
    },
    /**
     * Create a specfile right for an userx
     */
    create_specfile: (req, res) => {
        var id_node = req.params.node,
            administration = req.query.administration,
            read_right = req.query.read,
            write_right = req.query.write,
            id_specfile = req.query.file,
            id_affectation = req.query.affectation;

        connection.query("INSERT INTO right_file (administration, read_right, write_right, id_affectation, id_specfile, id_node) VALUES (?, ?, ?, ?, ?);", [administration, read_right, write_right, id_affectation, id_specfile, id_node], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();

        });
    },
    /**
     * Create a 3dfile right for an user
     */
    create_file3d: (req, res) => {
        var id_node = req.params.node,
            administration = req.query.administration,
            read_right = req.query.read,
            write_right = req.query.write,
            id_file3d = req.query.file,
            id_affectation = req.query.affectation;

        connection.query("INSERT INTO right_file (administration, read_right, write_right, id_affectation, id_files3d, id_node) VALUES (?, ?, ?, ?, ?);", [administration, read_right, write_right, id_affectation, id_file3d, id_node], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();
        });
    },
    /**
     * Update a 3dfile right for an user
     */
    update_file3d: (req, res) => {
        var administration = req.query.administration,
            read_right = req.query.read,
            write_right = req.query.write,
            id_file3d = req.query.file,
            id_affectation = req.query.affectation;


        connection.query("UPDATE right_file SET administration = ?, read_right = ? WHERE id_affectation = ? AND id_files3d = ?", [administration, read_right, write_right, id_affectation, id_file3d], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();
        });
    },
    update_specfile: (req, res) => {
        var administration = req.query.administration,
            read_right = req.query.read,
            write_right = req.query.write,
            id_affectation = req.query.affectation,
            id_specfile = req.query.file;

        connection.query("UPDATE right_file SET administration = ?, read_right = ? WHERE id_affectation = ? AND id_specfile = ?", [administration, read_right, write_right, id_affectation, id_specfile], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();
        });
    },
    remove_file3d: (req, res) => {
        var id_affectation = req.query.affectation,
            id_file3d = req.query.file;

        connection.query("DELETE FROM right_file WHERE id_affectation = ? AND id_files3d = ?", [id_affectation, id_file3d], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();
        });
    },
    remove_specfile: (req, res) => {
        var id_affectation = req.query.affectation,
            id_specfile = req.query.file;

        connection.query("DELETE FROM right_file WHERE id_affectation = ? AND id_specfile = ?", [id_affectation, id_specfile], err => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else res.status(200).end();
        });
    }
};

module.exports = rightsfile;