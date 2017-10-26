const connection = require('../database/index');

var rights = {
    /**
     * Vérifie que l'utilisateur a les droits necessaires (ici droit administrateur) pour modifier les droits d'autrui
     */
    admin_verification: (req, res, next) => {
        var id = req.sessions.id,
            node = req.params.node;

        connection.query("SELECT administration from rights WHERE id_node = ? AND id_affectation = (SELECT id FROM affectation WHERE id_user = ?);", [node, id],
            (err, result, fields) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(500).send("Intern Error");
                } else if (result.length === 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(500).send("Not enough rights");
                } else {
                    next();
                }
            });
    },
    /**
     * Vérifie que l'utilisateur a les droits necessaires (ici droit administrateur) pour modifier les droits d'autrui
     */
    write_verification: (req, res, next) => {
        var id = req.sessions.id,
            node = req.params.node;
        connection.query("SELECT write_rights FROM rights WHERE id_node = ? AND id_affectation = (SELECT id FROM affectation WHERE id_user = ?);", [id, node], (err, results, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else if (result.length === 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(500).send("Not enough rights");
            } else {
                next();
            }
        });
    },
    /**
     * Give all the rights for a node
     */
    all_by_node: (req, res, next) => {
        var id_node = req.params.node;

        connection.query('SELECT * FROM rights WHERE id_node = ?', [id_node],
            (err, results, fields) => {
                if (err) {
                    console.log(err.sqlMessage);
                    res.status(500).send("Intern Error");
                } else if (results.length === 0) {
                    res.status(401).send("Incorrect parameters");
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(results));
                }
            });
    },
    /**
     * Envoie les droits d'utilisateurs depuis une node.
     */
    user_right_node: (req, res, next) => {
        var id_node = req.params.node,
            id_user = req.sessions.id;

        connection.query("SELECT * FROM rights WHERE id_node = ? AND id_user = ?", [id_node, id_user],
            (err, result, fields) => {
                if (err)
                    next(err);
                else if (results.length === 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.statussend(null);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(results));
                }
            }
        );
    },
    /**
     * supprime les droits d'un utilisateur sur une node
     */
    remove: (req, res, next) => {
        var id_user = req.sessions.id,
            id_node = req.params.node;
        connection.query("DELETE FROM rights WHERE id_affectation = ? and id_node = ?", [id_user, id_node], err => {
            if (err)
                next(err);
        });
        connection.query("DELETE FROM rights_file WHERE id_affectation = ? and id_node = ?", [id_user, id_node], err => {
            if (err)
                next(err);
        });
    },
    alter: (req, res, next) => {
        /**
         * Lorsque l'on fait une requête sur cette node
         */
        var id_user = req.sessions.id,
            id_node = req.params.node,
            id_usercible = req.query.id_usercible,
            write_right = req.query.write,
            read_right = req.query.read,
            administration_right = req.query.administration;

        connection.query("UPDATE rights SET administration_right = ?, read_right = ?, write_right = ?, WHERE  id_node = ? AND id_user = ?", [], (err) => {
            if (err)
                next(err);
            else
                res.status(200).end();
        });
    },
    /**
     * Créer un nouveau droit pour un utilisateur unique.
     */
    create_for_node: (req, res) => {
        var id_affectation = req.query.affectation,
            administration = req.query.administration,
            read_right = req.query.read,
            write_right = req.query.write,
            id_node = req.params.node;
        connection.query("INSERT INTO rights (administration, read_right, write_right, id_affectation, id_node) VALUES (?, ?, ? ,?, ? );", [administration, read_right, write_right, id_affectation, id_node], (err) => {
            if (err) {
                console.log(err.sqlMessage);
                res.status(500).send("Intern Error");
            } else {
                res.status(200).end();
            }
        });
    },

    error_handler: (err, req, res, next) => {
        //A définir

    },
};

module.exports = rights;