
//const fs = require("fs");
//const dir = "/var/log/dms";
class AppError extends Error {
    constructor (message){
        super(message);
        this.name = this.constructor.name;//"AppError";
  //      let timeStamp = new Date();
  //      let text = "\r\n"+timeStamp.getTime() + " " + message;
  //      fs.appendFileSync( dir + "/errors.log", text);
    }
}
class ValidationError extends AppError {

}
class PropertyRequireError extends ValidationError{
    constructor (property){
        super("Требуется свойство " + property);
        this.property = property;
    }
}
module.exports = {AppError, ValidationError, PropertyRequireError};