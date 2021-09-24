const express = require("express");
const mongoose = require("mongoose");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");
const baseRouter = require("./routes/baseRouter.js");
const settingsRouter = require("./routes/settingsRouter.js");
const app = express();


app.set("view engine", "hbs");// устанавливаем движок предствалений
// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts", 
        defaultLayout: "layout",
        extname: "hbs"
    }
))

hbs.registerPartials(__dirname + "/views/partials"); // регистрация частичных представлений


app.use("/settings", settingsRouter);
app.use("/", baseRouter);
mongoose.connect("mongodb://10.129.14.150:27017/usersdb", {useUnifiedTopology: true, useNewUrlParser: true}, 
function(err){
    if(err) return console.log(err);
    app.listen(3001, function(){
        console.log("Сервер ожидает подключения...");
    });
});