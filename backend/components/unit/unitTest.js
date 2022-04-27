
const mongoose = require('mongoose');
//const Template = require('./components/template/template.js');
const Unit = require('./unit.js');
//const request = require('supertest');
// mocha = require('mocha');
let chai = require('chai');
const Template = require('../template/template.js');
const Item = require('../item/item.js');
//let chaiHttp = require('chai-http');
const server = require('../../cmd/app.js').app;
//let should = chai.should();

let testTemplate = {};
let testUnitId = null;
let nameOfUnit = "Test Unit "+ (new Date).getTime();//.getUTCSeconds();//.getMilliseconds();

let unitCRUD = () => {
    let deleteAllUnits = (done)=>{
        Unit.deleteMany({}, (err)=>{
            Item.deleteMany({},(err)=>{
                done();
            });
        });
    }
    before( (done)=> deleteAllUnits(done) );
  //  after( (done)=> deleteAllUnits(done) );
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
        let testUnit = {name:nameOfUnit, template: null}
        before( (done)=>{
            Template.findOne({}, (err, doc)=>{
                testTemplate = doc;
//                templateId = doc['_id'];
                testUnit.template = testTemplate._id;
                done();
            });
        });
        after( (done)=> deleteAllUnits(done) );
        it('it should NOT create unit without name',(done) => {
        chai.request(server)
        .post("/units/create")
        .send({template:'11'})
        .end((err, res)=>{
            res.should.have.status(500);
            res.body.should.to.deep.equal({});
        })
        done();
        });
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
            //  console.log(res.text);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data.should.have.property('name', testUnit.name);
                //res.body.data.should.have.property('template').eql(testUnit.template);
                res.body.data.should.have.property('items').be.a('array');
                res.body.data.items.length.should.be.eq( testTemplate.items.length );
                //res.body.data.items.should.to.deep.equal( testTemplate.items);
                res.body.data.should.have.property('triggers').be.a('array');
                res.body.data.triggers.length.should.be.eq( testTemplate.triggers.length );
                //res.body.data.triggers.length.should.be.eq(1);
            //  console.log(res.text);
                testUnit.items = res.body.data.items;
//                console.log(testUnit);
            });
            done();
        });
    });
    describe('get unit data. /GET /units/[metadata, config]', () => {
        //перед первым тестом создаем unit с которого будем получать данные
        let tmpUnit = null;
        before('Create new Unit', (done) => {
            Template.findOne({}, (err, template)=>{
                Unit.create({name:"Test unit A", template: template._id}, (err, res)=>{
                    tmpUnit = res;
                    done();
                });    
            });
        });
        after( (done)=> deleteAllUnits(done) );
        it('it should GET /units', (done) => {//проверяем получение данных для web
        chai.request(server)
            .get('/units')
            .end((err, res) => {
            //     console.log( res );
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg', "units info list");
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                res.body.data.forEach((unit)=>{
                    unit.should.have.property("name");
                    unit.should.have.property("templateName");
                    unit.items.forEach((item)=>{
                        item.should.have.property('name');
                        item.should.have.property('value');
                        item.should.have.property('dim');
                        item.should.have.property('status');
                        });
                })
                //res.body.length.should.be.eql(0);
                done();
            });
        });
        it('it should GET /units/metadata', (done) => {//проверяем получение данных для скрипта опроса
            chai.request(server)
                .get('/units/metadata')
                .end((err, res) => {
                //     console.log( res );
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg', "units metadata list");
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.forEach((unit)=>{
                        unit.should.have.property("name");
                     //   unit.should.have.property("template");
                        unit.items.forEach((item)=>{
                            item.should.have.property('_id');
                            item.should.have.property('name');
                            item.should.have.property('meta');
                            item.meta.should.be.a('array');
                            });
                    })
                    //res.body.length.should.be.eql(0);
                    done();
                });
            });
        it('it should GET /units/config', (done) => {//проверяем получение данных для конфигурации через web
            chai.request(server)
                .get('/units/config')
                .end((err, res) => {
                //     console.log( res );
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg', "units config list");
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.forEach((unit)=>{
                        unit.should.have.property("name");
                        unit.should.have.property("templateName");
                        unit.should.have.property("enabled");
                    })
                    //res.body.length.should.be.eql(0);
                    done();
                });
            });
    });
    describe('update unit items. /POST /items/update', ()=>{
        //перед первым тестом создаем unit с которого будем получать данные
        let tmpUnit = null;
        before('Create new Unit', (done) => {
            Template.findOne({}, (err, template)=>{
                Unit.create({name:"Test unit B", template: template._id}, (err, res)=>{
                    tmpUnit = res;
                    done();
                });    
            });
        });
        it('it should update unit items and calculate triggers. /POST /items/update', (done)=>{

            
            done();
        });
        it('it should find item history and trigger event. /GET /history/:itemid', (done)=>{

            done();
        });
        it('it should find trigger event. /GET /events/:triggerid', (done)=>{

            done();
        });
    });
}
module.exports = unitCRUD;