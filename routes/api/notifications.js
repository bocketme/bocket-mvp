const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    connection = require('../../database/index');


router.post('/api/notifiscation_read/:idnotification', (req, res) => {
    let idnotification = req.params.idnotification;

    connection.query("UPDATE notifications SET (is_read = 1) WHERE id = ?", [idnotification], () => {
        if (err) {
            console.log(err.sqlMessage);
            res.status(500).send("Intern Error");
        } else if (!results)
            res.status(404).send("Not Found").end();
        else if (result.length === 0) {
            res.status(404).send("Not Found").end();
        } else {
            res.status(200).send(JSON.stringify(result));
        }
    });
});

/**
 * Get notifications by user's id 
 */
router.get('/api/notifications/:id', (req, res) => {
    let userId = req.params.id;
    connection.query("SELECT notifications.* FROM notifications, user where (user.id = ?)", [userId], (err, results, fields) => {
        if (err) console.log(err);
        res.setHeader('Content-Type', 'application/json');
        if (results.length === 0) {
            res.status(404).end("Notification Not Found");
        } else {
            res.send(JSON.stringify(results));
        }
    });
});

/**
 * Get all the unread notifications from the user
 */
router.get('/api/unread-notifications/:id', (req, res) => {
    let userId = req.params.id;
    connection.query("SELECT notifications.* FROM notifications, user where (user.id = ?) AND (notifications.is_read = 0)", [userId], (err, results, fields) => {
        res.setHeader('Content-Type', 'application/json');
        if (err) console.log(err);
        if (results.length === 0) {
            res.status(404).end("Notification Not Found");
        } else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});

module.exports = router;