let router = require('express').Router();

router.get('/obj', (req, res) => {
    /*
     * Le contenu du json doit être envoyé avec la methode (res.json(/ici/)) comme montré ci-dessous
     * Si tu veux que je te rajoute des paramètres en plus (pour que l'on rende le tout dynamique, et bien soit
     * tu vois ça avec Vincent soit on voit ça demain.
     */
    res.json({name : 'Bonjour'});
});

module.exports = router;