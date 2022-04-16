const mongoose = require("mongoose");
const express = require("express");
const app = express();
const parserJson = express.json();

const templateRouter = require("./routers/templateRouter.js");
const unitRouter = require("./routers/unitRouter.js");


let use = ( method ) =>{
    
    return method;
};
app.use("/template",     templateRouter );
app.use("/units",     unitRouter );
/*
app.use("/", function(reg, res, next){
    console.log("Midleware 1");
    next();
});
app.use("/static", express.static(__dirname+"/public"))
app.use("/none", function(req, res){
    res.sendStatus(404);
});
app.use("/", function(req, res){
    res.sendFile(__dirname+"/index.html")
});
*/
mongoose.connect("mongodb://localhost:27017/dms", { useUnifiedTopology: true }, function(err){
    if(err) return console.log(err);
        app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});
//app.listen(3000);