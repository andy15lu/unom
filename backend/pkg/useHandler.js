let useHandler = async ( req, res, handler ) =>{
    try{
        let customRequest = {params: req.params, body: req.body};
        let handlerResponse = await handler( customRequest );
        res.send( handlerResponse );
    }
    catch( err ){
        res.sendStatus(500);
        
    }
};

module.exports = useHandler;