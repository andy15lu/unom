
const mongoose = require('mongoose');
//const Template = require('./components/template/template.js');
const Unit = require('./unit.js');
//const request = require('supertest');
// mocha = require('mocha');
let chai = require('chai');
const Template = require('../template/template.js');
const Item = require('../item/item.js');
const Event = require('../event/event.js');
const History = require('../history/history.js');
const { post } = require('./unitRouter.js');
//let chaiHttp = require('chai-http');
const server = require('../../cmd/app.js').app;
//let should = chai.should();


let testUnitId = null;
let templateObject = {
    "name": "Test template",
    "code": "1",
    "items": [
        {"name": "Item A", "type": "float", "dim": "dB", "code":"itema", "meta":[]},
        {"name": "Item B", "type": "float", "dim": "", "code":"itemb", "meta":[]},
    ],
    "triggers": [
        {"name":"Item A ниже нормы", "condition":"i.itema < 18", "status": 3, "code": "itema_alarm", "targetItem": "itema"}
    ],
};
let nameOfUnit = "Test Unit "+ (new Date).getTime();//.getUTCSeconds();//.getMilliseconds();

let shouldHaveMsgAndDataFields = (res) =>{
    res.body.should.be.a('object');
    res.body.should.have.property('msg');
    res.body.should.have.property('data');
    res.body.data.should.be.a('array');
}
let clearTestBase = (callback)=>{
    Template.deleteMany({},()=>{
        Unit.deleteMany({}, ()=>{
            Item.deleteMany({}, callback);
        });
    });
}
let createTemplateAndUnit = (template, callback)=>{
    Template.create(template, (err, res)=>{
        chai.request(server)
        .post('/units/create')
        .send({name:"Test Unit A", template:res._id})
        .end((err, res)=>{
            callback(err, res);
        });
    });
};
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
        //перед первым тестом создаем unit который будем тестировать
        let tmpUnit = null;
        before('Create new Unit', (done) => {
            let testTemplate = {
                "name": "Test template for triggers",
                "code": "1",
                "items": [
                    {"name": "Eb/N0", "type": "float", "dim": "dB", "code":"ebno", "meta":[{"param":"ebno"}]},
                ],
                "triggers": [
                    {"name":"Eb/N0 ниже нормы", "condition":"i.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
                ],
            };
                Template.create(testTemplate, (err, template)=>{
                //  console.log({name:"Test unit B", template: template._id});
                chai.request(server)
                .post("/units/create")
                .send({name:"Test unit B", template: template._id})
                .end((err, res)=>{
                        tmpUnit = res.body.data;
                    done();
                });
                });
        });
        it('it should update items, calc triggers and check events and hstory. /POST /items/update', async ()=>{
            let newValues = [];
            let res = await chai.request(server)
                    .get('/units/metadata')
                    .send();
            res.should.have.status(200);
            /*res.body.should.be.a('object');
            res.body.should.have.property('msg');
            res.body.should.have.property('data');
            res.body.data.should.be.a('array');*/
            shouldHaveMsgAndDataFields(res);
        //    console.log(res.body.data[0]);
            for(let item of res.body.data[0].items){
                let val = {};
                val[''+item._id] = 0;
                newValues.push(val);
            }
            res =  await chai.request(server).post('/items/update').send(newValues);
            res.should.have.status(200);
            res.should.have.property('body');
            res.body.should.to.deep.equal({msg: "ok", data: []});
            res = await chai.request(server)
                    .get('/units/'+tmpUnit._id)
                    .send();
            let resultUnit = res.body.data;
            if( +resultUnit.triggers[0]['state'] != 1 )//проверяем что триггер сработал
                throw new Error('Trigger was not set to 1');
            let event = await Event.findOne({trigger: resultUnit.triggers[0]._id});
            if(!event)
                throw new Error('Event was not found');
            let history = await History.findOne({item: resultUnit.items[0]._id, value:0});
            if(!history)
                throw new Error('History was not found');
          //  console.log(event);
        });
    });
}
let unitSettingsCRUD = () =>{
    describe("Unit settings CRUD", ()=>{

        describe("get unit settings info", ()=>{

        } );
        describe("update name and enabled flag", ()=>{
            let uId = null;
            before("Clear db and create Unit", (done)=>{
                clearTestBase(()=>{
                    createTemplateAndUnit(templateObject, (err,res)=>{
                        tmpUnit = res;
                        uId = res._id;
                        done();
                    });
                });
            });
            it("it should NOT set empty name", (done)=>{
                chai.request(server)
                .put("/units/"+uId)
                .send({name:""})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
            it("it should set name only", (done)=>{
                chai.request(server)
                .put("/units/"+uId)
                .send({name:"newName"})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('name', "newName");
                    done();
                });
            });
            it("it should set enabled flag only", (done)=>{
                chai.request(server)
                .put("/units/"+uId)
                .send({enabled:true})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('enabled').eq(true);
                    done();
                });
            });
            it("it should set name and enabled flag", (done)=>{
                chai.request(server)
                .put("/units/"+uId)
                .send({name:"newName2",enabled:true})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('name', "newName2");
                    res.body.data[0].should.have.property('enabled').eq(true);
                    done();
                });
            });
        });
        describe("update triggers", ()=>{
            tmpUnit = null;
            tId = null;
            beforeEach((done)=>{
                clearTestBase(()=>{
                    createTemplateAndUnit(testTemplate, (err,res)=>{
                        tmpUnit = res;
                        tId = res.triggers[0]._id;
                        done();
                    });
                });
            });
            it("it should NOT set empty triger name", (done)=>{
                let tId = null;
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({name:""})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
            it("it should NOT set too long trigger name", (done)=>{
                let tId = null;
            
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({name:"TooLongTriggerName99999999999999999999999999999999999999"})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            
            });
            it("it should NOT set incorrect trigger status", (done)=>{
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({status:"*%^&$#@9"})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
            it("it should NOT set empty trigger condition", (done)=>{
                let tId = null;
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({condition:""})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
            it("it should NOT set too long trigger condition", (done)=>{
                let tId = null;
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({condition:"hsggdfgjfgjfggerupewvcavniusvbfvdyfiwufbewvjskfhsaouifhewfdsvvvfvfvfvdvfdsvfdvfdvfdshgdskjfhsdjkf"})
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
            });
            it("it should set name only", (done)=>{
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({name:"New Trigger name"})
                .end((err, res) => {
                    res.should.have.status(200);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('name', "New Trigger name");
                    done();
                });
            });
            it("it should set status only", (done)=>{
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({status:4})
                .end((err, res) => {
                    res.should.have.status(200);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('status').eq(4);
                    done();
                });
            });
            it("it should set condition only", (done)=>{
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({condition:"i.itema<17"})
                .end((err, res) => {
                    res.should.have.status(200);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('condition').eq("i.itema<17");
                    done();
                });
            });
            it("it should set enabled, name, status, condition, item", (done)=>{
                chai.request(server)
                .put("/units/trigger/"+tId)
                .send({
                    enabled: true,
                    name: "New Trigger name",
                    status: 4,
                    condition:"i.itema<17",
                    item:null,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    shouldHaveMsgAndDataFields(res);
                    res.body.data[0].should.have.property('status').eq(4);
                    res.body.data[0].should.have.property('enabled').eq(true);
                    res.body.data[0].should.have.property('name').eq("New Trigger name");
                    res.body.data[0].should.have.property('condition').eq("i.itema<17");
                    res.body.data[0].should.have.property('item').eq("itema");
                    done();
                });
            });
        });
    });
}
module.exports = {unitCRUD, unitSettingsCRUD};
/*
Unit
Change settings
    change name. /PUT /units/:id
        empty name
        too long name
        correct name
    change enabled. /PUT /units/:id
        empty
        not boolean
        true
        false
    change trigger. /PUT /units/trigger/:id
        change trigger name
            empty
            too long
            correct
        change enabled
            empty
            not boolean
            true
            false
        change status
            empty
            incorrect
            correct
        change item
            empty is OK
            too long 
            correct
        change condition
            empty
            too long
            incorrect js code
            correct js code
    add trigger. /POST /units/trigger/
        if no field
            name
            enabled
            status
            item
            condition
        fields validate
            name field
                empty name
                used spaces
                too long name
            enabled field
                empty
                too long
            status 
                empty
                too long
            item
                empty
                too long
            condition
                empty
                too long
                incorrect js code
        correct request
            should create new trigger
    change constants. /PUT /units/:id

    add constant. /POST /units/addconst/:id

    change item /PUT /items/:id

    add item. /POST /unit/additem/:id
*/