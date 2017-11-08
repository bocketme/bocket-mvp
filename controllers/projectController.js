let project = require('../models/project'),
    jwt = require('jsonwebtoken');

// ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT

module.exports = {
    /**
     * Affiche tous les projets d'un utilisateur
     * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
     */
    usejwt: (req, res, next) => {
        console.log('pourquoi ?');
        let token = jwt.sign({ email: 'baba@bocket.me', username: 'baba' },
            "je suis ingenieur informaticien, jaime les ordinateurs", { algorithm: 'HS512', expiresIn: 2, subject: 'user' },
            (err, token) => {
                if (err)
                    console.log(err);
                else
                    console.log(token);
            });
        next();
    },
    index: (req, res) => {res.render('hub.twig');},
    /**
     * Ajoute un projet à l'utilisateur X
     */
    add: (req, res) => {
    res.send();
    },
    /**
     * Modifie les données d'un projet
     * 1 - Vérifie les autorisations de l'utilisateur
     * 2 - Supprime le projet
     * 3 - Envoie une réponse 200
     * 2.1 - Envoie une réponse "Not Authorized"
     */
    update: (req, res) => {res.send()},
    /**
     * Supprime un projet :
     * 1 - Vérifie les autorisations de l'utilisateur
     * 2 - Supprime le projet
     * 3 - Envoie une réponse 200
     * 2.1 - Envoie une réponse "Not Authorized"
     */
    delete: (req, res) => {
        // project.findByIdAndRemove()
    }
}