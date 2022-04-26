
const mongoose = require('mongoose');
//const Template = require('./components/template/template.js');
const Unit = require('./unit.js');
//const request = require('supertest');
// mocha = require('mocha');
let chai = require('chai');
const Template = require('../template/template.js');
//let chaiHttp = require('chai-http');
const server = require('../../cmd/app.js').app;
//let should = chai.should();

let testTemplate = {};
let testUnitId = null;
let testUnit = {name:'Test Unit', template: null}
let unitCRUD = () => {
    before( (done)=>{
        Unit.deleteMany({}, (err)=>{
            done();
        });
    });
    describe('GET units from empty base. /GET /units/[metadata, config]', () => {
        it('it should GET /units', (done) => {
        chai.request(server)
            .get('/units')
            .end((err, res) => {
           //     console.log( res );
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.to.deep.equal({msg:"units info list", data:[]});
             //   res.body.length.should.be.eql(0);
                done();
            });
        });
        it('it should GET /units/metadata', (done) => {
        chai.request(server)
            .get('/units/metadata')
            .end((err, res) => {
            //     console.log( res );
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.to.deep.equal({msg:"units metadata list", data:[]});
                //   res.body.length.should.be.eql(0);
                done();
            });
        });
        it('it should GET /units/config', (done) => {
            chai.request(server)
                .get('/units/config')
                .end((err, res) => {
                //     console.log( res );
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.to.deep.equal({msg:"units config list", data:[]});
                    //   res.body.length.should.be.eql(0);
                    done();
                });
            });
    });
    describe('create Unit. /POST /units/create', () => {
        let templateId = null;
        before( (done)=>{
            Template.findOne({}, (err, doc)=>{
                testTemplate = doc;
//                templateId = doc['_id'];
                testUnit.template = testTemplate._id;
                done();
            });
        });
        it('it should NOT create unit without name',(done) => {
        chai.request(server)
        .post("/units/create")
        .send({template:'11'})
        .end((err, res)=>{
            res.should.have.status(500);
            res.body.should.to.deep.equal({});
        })
        done();
        })
    
        it('it should NOT create unit without template',(done) => {
        chai.request(server)
        .post("/units/create")
        .send({name:'11'})
        .end((err, res)=>{
            res.should.have.status(500);
            res.body.should.to.deep.equal({});
        })
        done();
        });
        it('it should NOT create unit with bad template id',(done) => {
        chai.request(server)
        .post("/units/create")
        .send({name:'11', template:"0012245212452441"})
        .end((err, res)=>{
            res.should.have.status(500);
            res.body.should.to.deep.equal({});
        })
        done();
        });
        it('it should create unit',(done) => {
        //    console.log(testUnit);
            chai.request(server)
            .post("/units/create")
            .send(testUnit)
            .end((err, res)=>{
             //   console.log(res.text);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('name', testUnit.name);
                //res.body.data.should.have.property('template').eql(testUnit.template);
                res.body.data.should.have.property('items').be.a('array');
                res.body.data.items.length.should.be.eq( testTemplate.items.length);
                //res.body.data.items.should.to.deep.equal( testTemplate.items);
                res.body.data.should.have.property('triggers').be.a('array');
                res.body.data.triggers.length.should.be.eq( testTemplate.triggers.length);                
                //res.body.data.triggers.length.should.be.eq(1);
           //     console.log(res.text);
            })
            done();
        });
    });
    describe('update unit. /POST /items/update', ()=>{
        it('it should NOT update with uncorrect ', (done)=>{
            
        })
    });
}
module.exports = unitCRUD;