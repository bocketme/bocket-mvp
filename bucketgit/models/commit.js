nodegit = require('nodegit');

class Commit {
    constructor(author, date, message) {
        this.author = author;
        this.date = date;
        this.message = message;
    }
}

module.exports = Commit;
