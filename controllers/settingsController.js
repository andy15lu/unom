const Unit = require("../models/unit.js");
const unitModel = require("../models/unitModel.js"); 

exports.settings = function (request, response){
    
    //    units: [{name:'modem1', model:'qx', _ip:'10.10.8.1', enabled:true}]
        Unit.find({}).populate('unitModel', 'name')
        .exec( function(err, allUnits){
            if(err) {
                console.log(err);
                return response.sendStatus(400);
            }
            console.log(allUnits);
            let units = allUnits.map( unit => ({name: unit.name, unitModel: unit.unitModel.name, ip: unit.ip, enabled: (unit.enabled?'checked':'') }));//
            console.log(units);
            response.render("settings.hbs", {
                units: units
            });
        });
    
};
exports.createModel = function (request, response){
    response.render("createModel.hbs");
};
exports.postUnitsEdit = function (request, response){
    if(!request.body) return response.sendStatus(400);
    let units = [
        {name: "name", ip:"ip", unitModel: "model", enabled: true},
        {name: "name", ip:"ip", unitModel: "model", enabled: true}
    ]
    response.render("createModel.hbs");
};
exports.test = function (request, response){
 /*   let newModel = new unitModel({
        name: "cdm QX",
        items: [
        {name:"Eb/N0", code:"code", dim:"дЅ"},
        {name:"Buffer",code:"buffer", dim:"%"},      
        {name:"BER", code:"ber", dim:""},
        {name:"RSL", code:"rsl", dim:"дБмв"},
        {name:"Freq Offset", code:"foffset", dim:"кГц"},
        {name:"Delay", code:"delay", dim:"мс"},
        {name:"Ratio", code:"ratio", dim:""},
        {name:"Remote Eb/N0", code:"rebn", dim:"дБ"},
        {name:"Alarms", code:"alarms", dim:""}
        ]
    });
    newModel.save( err => console.log(err));*/
    let newUnit = new Unit({
        name: "cdm QX",
        checktime: "",
        enabled: true,
        ip: "10.10.8.1",
        unitModel:  "614c1fa00e31e88d161b4d76",
        "items": [{
            "name": "Eb/N0",
            "code": "code",
            "dim": "дБ",
            "value": ""
        }, {
            "name": "Buffer",
            "code": "buffer",
            "dim": "%",
            "value": ""
        }, {
            "name": "BER",
            "code": "ber",
            "dim": "",
            "value": ""
        }, {
            "name": "RSL",
            "code": "rsl",
            "dim": "дБмВт",
            "value": ""
        }, {
            "name": "Freq Offset",
            "code": "foffset",
            "dim": "кГц",
            "value": ""
        }, {
            "name": "Delay",
            "code": "delay",
            "dim": "мс",
            "value": ""
        }, {
            "name": "Ratio",
            "code": "ratio",
            "dim": "",
            "value": ""
        }, {
            "name": "Remote Eb/N0",
            "code": "rebn",
            "dim": "дБ",
            "value": ""
        }, {
            "name": "Alarms",
            "code": "alarms",
            "dim": "",
            "value": ""
        }]

    });
    newUnit.save();
    response.render("test.hbs");
};