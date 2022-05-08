const errorLog = require("./log.js");
let useHandler = async ( req, res, handler ) =>{
    try{
        let customRequest = {params: req.params, body: req.body};
        let handlerResponse = await handler( customRequest );
        res.send( handlerResponse );
    }
    catch( err ){

    //    res.s
     //   console.log(err.message);
        errorLog(err);
        res.status(500).send(err.message);
        
    }
};

module.exports = useHandler;