const Unit = require("../models/unit.js");
 
exports.table = function (request, response){
    response.send("table");
};
exports.settings = function (request, response){
    response.render("settings.hbs",{
        units: [{name:'modem1', model:'qx', _ip:'10.10.8.1', enabled:true}]
    });
};
exports.diagram = function (request, response){
    response.send("diagram");
};