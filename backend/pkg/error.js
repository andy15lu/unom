
const dir = "/var/log/dms";
class AppError extends Error {
    constructor (message){
        super(message);
        this.name = "AppError";
        
    }
}