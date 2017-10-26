const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    connection = require('../../database/index');

/**
 * Get a specific user with his id
 */
router.get("/api/users/:id", (req, res) => {
    userId = req.params.id;
    connection.query("SELECT * FROM user where id =  ?", [userId], (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length === 0) {
            res.status(404).end("There is no result");
        } else {
            res.send(JSON.stringify(results));
        }
    });
});

/**
 * Get the team id by user
 */
var getUserTeamId = (req, res) => {
    let userId = req.params.idUser;

    connection.query("SELECT affectation.id_team FROM affectation where id_user = ?", [userId], (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length === 0) {
            res.status(404).end("There is no result");
        } else {
            res.send(JSON.stringify(results));
        }
    });
};

router.get('/api/user/getteamid/:idUser', getUserTeamId);

/**
 * Deleting a user from databse => Suppressing account
 */
var verificate_user = (req, res, next) => {

    //TODO: A refaire
    userId = req.params.id;
    user_id = req.query.id;
    if (user_id === user_id)
        next();
    else {
        res.setHeader('Content-Type', 'application/json');
        res.status(404).end("No Result");
    }

};
var delete_user = (req, res) => {
    userId = req.params.id;
    connection.query("DELETE FROM user where id = ?", [userId], (err, results, fields) => {
        if (err) console.log(err);

        res.setHeader('Content-Type', 'application/json');

        if (results.length === 0) {
            res.status(404).end("There is no result");
        } else {
            res.status(200).send(JSON.stringify(results));
        }
    });
};
router.get("/api/delete/user/:id", [verificate_user, delete_user]);

module.exports = router;