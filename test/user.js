'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('SignUp', _ => {
    it('Should add a new user, organization and workspace in the database', done => {

        const SignUpInfo = {}

        chai.request(server)
            .post('/')
            .send(SignUpInfo)
            .end((err, res) => {
                /**
                 * Ici tu mets tout ce que ta réponse doit contenir
                 * Exemple :
                 *   res.body.user.should.have.property('name');
                 */
                done();
            });
    });
});
