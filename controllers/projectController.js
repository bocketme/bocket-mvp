let project = require('../models/project'),
jwt = require('jsonwebtoken'),
key = require('../utils/keys');
// ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT

module.exports = {
    /**
    * Affiche tous les projets d'un utilisateur
    * ALPHA - Ne marche qu'avec un seul utilisateur, dont on a enregistré les donnée dans un JWT
    */
    usejwt: (req, res, next) => {
        let data = {
            email: 'baba@bocket.me',
            username: 'baba'
        };
        let token = jwt.sign(data, key, { algorithm: 'HS256', expiresIn: 2, subject: 'user' },
        (err, token) => {
            if (err) {
                console.log(err);
                next();
            } else {
                res.cookie('jwt', token);
                next();
            }
        });
    },
    index: (req, res) => {
        res.render('hub.twig', {
            title: req.params.workspace + ' - All Parts',
            in_use: req.params.workspace,
            data_header: 'All Parts',            
            user: 'Alexis Dupont',
            workspaces: ['moi', 'je0', 'suis', 'beau'],
            node: JSON.stringify(require('../test/node.json')),
            all_parts: 100,
            last_updates: 10,
            duplicates: 35
        });
    },
    last_updates: (req, res) => {
        res.render('hub.twig', {
            title: req.params.workspace + ' - Last Updates',
            in_use: req.params.workspace,
            data_header: 'Last Updates',            
            user: 'Alexis Dupont',
            workspaces: ['moi', 'je0', 'suis', 'beau'],
            node: JSON.stringify(require('../test/node.json')),
            all_parts: 100,
            last_updates: 10,
            duplicates: 35
        });
    },
    duplicates: (req, res) => {
        res.render('hub.twig', {
            title: req.params.workspace + ' - Duplicates',
            in_use:req.params.workspace,
            data_header: 'Duplicates',            
            user: 'Alexis Dupont',
            workspaces: ['moi', 'je0', 'suis', 'beau'],
            node: JSON.stringify(require('../test/node.json')),
            all_parts: 100,
            last_updates: 10,
            duplicates: 35
        });
    },
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
    update: (req, res) => { res.send() },
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