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

const unitCRUD = require("./components/unit/unitTest.js");

let templateId = null;
let testTemplate = {
    "name": "Test template",
    "code": "1",
    "items": [
        {"name": "Eb/N0", "type": "float", "dim": "dB", "code":"ebno", "meta":[{"param":"ebno", "oid":"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
        {"name": "BER", "type": "float", "dim": "", "code":"ber", "meta":[{"param":"ebno", "oid":"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
    ],
    "triggers": [
        {"name":"Eb/N0 ниже нормы", "condition":"i.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
    ],
};

describe("Template",()=>{
    before((done) => { //Перед тестоми чистим базу
        Template.deleteMany({}, (err) => { 
        done();
        });
    });
    /*
    * Тест для /GET 
    */

    describe('GET all template after remove', () => {
        it('it should GET all te templates', (done) => {
        chai.request(server)
            .get('/template')
            .end((err, res) => {
           //     console.log( res );
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.to.deep.equal({msg:"template list", data:[]});
             //   res.body.length.should.be.eql(0);
                done();
            });
        });
    });
    describe('Create template', () => {
        
        it('it should NOT create Template without name', (done) => {
        chai.request(server)
            .post('/template/add')
            .send({code:"1", items:[], triggers:[]})
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
            done();
           
            });
        });
        it('it should NOT create Template without code', (done) => {
        chai.request(server)
            .post('/template/add')
            .send({name:"1", items:[], triggers:[]})
            .end((err, res) => {
                
                res.should.have.status(500);
                res.body.should.be.a('object');
            done();
           
            });
        });
        it('it should create new Template', (done) => {
            chai.request(server)
                .post('/template/add')
                .send(testTemplate)
                .end((err, res) => {
                    
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    res.body.data.should.have.property('name', testTemplate.name);
                    res.body.data.should.have.property('code').eql('1');
                    res.body.data.should.have.property('items').be.a('array');
                    res.body.data.items.length.should.be.eq(2);
                    //res.body.data.items.should.to.deep.equal( testTemplate.items);
                    res.body.data.should.have.property('triggers');
                    res.body.data.should.have.property('triggers').be.a('array');
                    res.body.data.triggers.length.should.be.eq(1);
                done();
                templateId = res.body.data._id;
                });
            });
        it('it should GET a created template by id', (done) => {
  
            chai.request(server)
                .get('/template/'+templateId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('_id');
                    res.body.data.should.have.property('name', 'Test template');
                    res.body.data.should.have.property('code').eql('1');
                    res.body.data.should.have.property('items').be.a('array');
                    res.body.data.items.length.should.be.eq(2);
                    //res.body.data.items.should.to.deep.equal( testTemplate.items);
                    res.body.data.should.have.property('triggers');
                    res.body.data.should.have.property('triggers').be.a('array');
                    res.body.data.should.have.property('constants').be.a('array');
                    res.body.data.triggers.length.should.be.eq(1);
                done();
                //  templateId = res.body.data._id;
                });
        });
    });
    describe('GET all templates', () => {
        it('it should get array of all templates', (done) => {
        chai.request(server)
            .get('/template')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.should.have.property('data');
                res.body.data.should.be.a("array");
                res.body.data[0].should.have.property('name', testTemplate.name);
                res.body.data[0].should.have.property('code', testTemplate.code);
                res.body.data[0].should.have.property('items').be.a('array');
                res.body.data[0].should.have.property('constants').be.a('array');                

                done();
            });
        });
    });
});

describe('Unit CRUD', ()=>unitCRUD(templateId));
