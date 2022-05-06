const mongoose = require("mongoose");
const express = require("express");
const app = express();
let config = require('config'); 
//const parserJson = express.json();

const templateRouter = require("../components/template/templateRouter.js");
const unitRouter = require("../components/unit/unitRouter.js");
const itemRouter = require("../components/item/itemRouter.js");



app.use("/template",  templateRouter );
app.use(/\/units?/,     unitRouter );
app.use("/items",     itemRouter );

let dbName = "dms"
if(config.util.getEnv('NODE_ENV') === "test")
    dbName = 'dms-test';

mongoose.connect("mongodb://localhost:27017/"+dbName, { useUnifiedTopology: true });

let server = app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
});

module.exports.app = server;
//app.listen(3000);