const mongoose = require('mongoose');
const request = require('supertest');
const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');


let should = chai.should();
const server = require('../../cmd/app.js').app;
chai.use(chaiHttp);


/*
const Template = require('./template.js');
const mongoose = require('mongoose');

const request = require('supertest');
const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
//const server = require('./cmd/app.js').app;
const server = require('../../cmd/app.js').app;
let should = chai.should();
//var app = require('./cmd/app.js').app;
chai.use(chaiHttp);

*/

let shouldHaveMsgAndDataFields = (res) =>{
    res.body.should.be.a('object');
    res.body.should.have.property('msg');
    res.body.should.have.property('data');
    res.body.data.should.be.a('array');
}

function testTemplateCRUD(){

    describe('Template CRUD', ()=>{
        describe('Create. With incorrect name', ()=>{
            it('it should NOT create with no "name"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({code:"1", items:[], triggers:[]})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with empty "name"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"",code:"1", items:[], triggers:[]})
                .end((err, res) => {
                    //   console.log(res);
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with too long "name"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"TooLong name 1111111111111111111111111111111111111111111111111111111111111111",
                code:"1", items:[], triggers:[]})
                .end((err, res) => {
                    //   console.log(res);
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with special symbols in "name"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"7!@##%$^%^&%^&*()BHJJ _+;'`/\\\0",
                code:"1", items:[], triggers:[]})
                .end((err, res) => {
                    //   console.log(res);
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
        });
        describe('Create. With incorrect "code"', ()=>{
            it('it should NOT create with no "code"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"test name", items:[], triggers:[]})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with empty "code"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"test name",code:"", items:[], triggers:[]})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with too long "code"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"test name",code:"bhjkbfsajfbdsjbjshvbava876ihs78abvv8dfvdf8vbdfv", items:[], triggers:[]})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
            it('it should NOT create with special symbols in "code"',(done)=>{
                chai.request(server)
                .post('/template/add')
                .send({name:"test name",code:"h g()!@#$%^&^'&*'&()~\  \\098'/", items:[], triggers:[]})
                .end((err, res) => {
                    res.should.have.status(500);
                    shouldHaveMsgAndDataFields(res);
                    done();
                });
            });
        });
    });
}

module.exports = testTemplateCRUD;

/*
Template
    create with incorrect name
        no name
        empty name
        long name
        name with wrong symboly
    create with bad code field
        no code
        empty 
        long
        wrong symbols
    create with incorrect items field
        no items
        wrong item structure
            item.name
                no name
                empty
                long
                wrong symbols
            item.code
                no code
                empty
                long
                wrong symbols
            item.dim
            item.default
                no
                empty
                long
                wrong symbols
            item.meta
    create with incorrect triggers
        no triggers
        empty
        wrong structure
            name
                no 
                empty
                long
                wrong
            condition
                no 
                empty
                long
                wrong
            status
                no 
                empty
                long
                wrong
            code
                no 
                empty
                long
                wrong
            targetItem
                no 
                empty
                long
                wrong
    create with correct request
    get list of templates
        if no templates
        if one exist
        if many exist
    get one template
        if 
    change
    

*/