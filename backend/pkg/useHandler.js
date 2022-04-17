let useHandler = ( req, res, handler ) =>{
    try{
        res.send( handler(req) );
    }
    catch( err ){
        res.sendStatus(500);
    }
};

module.exports = useHandler;