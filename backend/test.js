process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Template = require('./components/template/template.js');
const request = require('supertest');
const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('./cmd/app.js').app;
let should = chai.should();
//var app = require('./cmd/app.js').app;
chai.use(chaiHttp);

describe("Template",()=>{
    beforeEach((done) => { //Перед каждым тестом чистим базу
        Template.deleteMany({}, (err) => { 
        done();
        });
    });
    /*
    * Тест для /GET 
    */
    describe('/GET template', () => {
        it('it should GET all the templates', (done) => {
        chai.request(server)
            .get('/template')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
             //   res.body.length.should.be.eql(0);
                done();
            });
        });
    });
});
