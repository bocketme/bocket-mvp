[![Build Status](https://travis-ci.com/bocketme/bocketme.svg?token=TazLshzovrqtnCMbsT4w&branch=master)](https://travis-ci.com/bocketme/bocketme)

# Bocket.me readme

Créer la base donnée avec le nom ```bocketmedev``` ou alors le nom souhaité. 

Tout d'abord, créez les deux fichiers suivants :
```database_config.json``` à la racine du projet et copiez ce code :
```
{
    "host": "Adresse de la base de données",
    "user": "Nom d'utilisateur de la base de données",
    "password": "Mot de passe de la base de données",
    "port": "Port de la base de données",
    "database": "Nom de la base de données"
}
```

Créez un dossier ```bucketrepositories``` à l'extérieur du dossier du projet, et dezippez l'archive ```Environnement_v1.zip``` dans le dossier ```bucketrepositories```

Et ```git_config.js``` dans le dossier ```bucketgit/``` :

```
var path = require("path");

const chemin = path.resolve("Chemin absolu du dossier bucketrepositories");

module.exports = chemin;
```


Pour finir :
``` make install ```

Pour lancer le serveur :
``` make run ```

Pour reset la base de données :
```make reset-database```

## Git Flow
Principes de base

Le principe de base de fonctionnement est d'avoir 2 branches principales
- master, est la branche qui sera reliée à la mise en production de votre application.
- develop, est une branche sur laquelle tous les développeurs vont travailler.

Mais si tout le monde commence à travailler sur la même branche, l'historique peut rapidement devenir fouilli et les modifications risquent de se court-circuiter. Ainsi on a second niveau de branche :
- Les branches feature/XXXX permettent de commencer à travailler sur une nouvelle fonctionnalité. On crée une nouvelle branche à partir de la branche develop, on fait nos commits dessus et quand on finit on fusionne sur la branche develop.
- Les branches release/XXXX permettent de faire la liaison entre la branche develop et la branche. En général cette branche contiendra des commits pour préparer une nouvelle release (on va changer le numéro de version dans le fichier readme par exemple).
- Les branches hotfix/XXXX permettent de publier rapidement une correction depuis la branche master. Une fois la correction validée nos modifications seront fusionnées sur la branche master et develop.

Cette petite "explication" à pour source le developpeur [Grafikart](https://www.grafikart.fr/formations/git/git-flow)

## How to contribute

Commit synthax :

* `[ADD] your message` - When you add anything new in the project
* `[REMOVE] your message` - When you are removing anything in the project
* `[UPDATE] your message` - When you are updating anything in the project
