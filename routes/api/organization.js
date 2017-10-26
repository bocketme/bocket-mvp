let app = require('express'),
    router = app.Router(),
    connection = require('../../database/index');

router.get("/api/organization/:owner", (req, res) => {
    let id_owner = req.params.owner;
    res.setHeader("content-type", "application/json");
    connection.query('SELECT * FROM organization where id_owner = ?', [id_owner], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!result)
            res.status(404).send("Not Found").end();
        else
            res.send(JSON.stringify(result));
    });
});

router.post("/api/organization/", (req, res) => {
    let id_owner = req.body.owner;
    let id_stripe = req.body.stripe;
    let id_project = req.body.project;
    res.setHeader("content-type", "application/json");


    connection.query('INSERT INTO organization (id_projet, id_stripe, id_owner) VALUES (?,?,?)', [id_project, id_stripe, id_owner], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send("Intern Error").end();
        } else if (!result)
            res.status(404).send("Not Found").end();
        else
            res.send(JSON.stringify(result));
    });
});

//  'DELETE FROM organization WHERE id_owner = ?', [$id_owner];

//  'UPDATE organization SET name = ? WHERE id = ?', [$new_name, $id_organization]

module.exports = router;