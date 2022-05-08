const fs = require("fs");

const dir = "/var/log/dms";

function errorLog( error ){
    try{
    let timeStamp = new Date();
    let text = "\r\n"+timeStamp.getTime() + (error.source?" "+error.source+":":"")+" [" + error.name + '] ' + error.message;
    fs.appendFileSync(dir+"/error.log", text);
    }catch(err){
        console.log("errorLog: "+err.message)
    }
}
module.exports = errorLog;
