const fs = require("fs");

const dir = "/var/log/dms";

function errorLog( error ){
    let timeStamp = new Date();
    let text = "\r\n"+timeStamp.getTime() + (error.source?" "+error.source+":":"")+" [" + error.name + '] ' + error.message;
    fs.appendFileSync(dir+"/error.log", text);
}
module.exports = errorLog;
