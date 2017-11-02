const collectionName = "emailBeta";

class BetaEmailRepository {
    constructor(db) {
        this.db = db;
        this.collection = db.collection(collectionName);
    }

    add(betaEmail) {
        return this.collection.insertOne(betaEmail);
    }

    find(betaEmail) {
        return this.collection.findOne(betaEmail);
    }

}

module.exports = BetaEmailRepository;
