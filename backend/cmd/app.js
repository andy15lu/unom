const mongoose = require("mongoose");
const express = require("express");
const app = express();
const parserJson = express.json();

const templateRouter = require("../components/template/templateRouter.js");
const unitRouter = require("../components/unit/unitRouter.js");
const unitRouter = require("../components/item/itemRouter.js");



app.use("/template",  templateRouter );
app.use("/units",     unitRouter );
app.use("/items",     itemRouter );

mongoose.connect("mongodb://localhost:27017/dms", { useUnifiedTopology: true }, function(err){
    if(err) return console.log(err);
        app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});
//app.listen(3000);