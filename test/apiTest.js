const request = require('supertest')

const app = require('../index')

describe('GET /movies', function () {
    it('respond with json containing a list of all movies', function (done) {
        request(app)
            .get('/movies')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
})

describe('GET /planets', function () {
    it('respond with json containing a list of all planets', function (done) {
        this.timeout(20000)
        request(app)
            .get('/planets')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
})