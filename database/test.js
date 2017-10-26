let connection = require('./index');


connection.query("ALTER TABLE node CHANGE id_projet id_projet INT(11) NULL, CHANGE id_branch id_branch INT(11) NULL",
    err => {
        if (err)
            console.error(err);
        else
            console.log('Alteration de la table pour developpement');
    });