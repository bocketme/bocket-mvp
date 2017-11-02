class BetaEmail {
    constructor(email) {
        this._email = email;
    }

    set email(value) {
        this._email = value;
    }

    get email() {
        return this._email;
    }
}

module.exports = BetaEmail;