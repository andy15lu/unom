const UnitTemplate = require("./template.js");

module.exports = {
    createTemplate: async (req, res)=>{

   /*     let example = {
            name: "Comtech cdm qx",
            code: "1001",
            items: [
                {name: "Eb/N0", type: "float", dim: "dB", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
                {name: "BER", type: "float", dim: "", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
            ],
        
        };*/
    const newTemplate = await UnitTemplate.create(req.body);
        res.send( JSON.stringify({msg:"", data: newTemplate}) );
    },
    getTemplate: async (req, res) =>{ //получить список всех шаблонов устройств
        try{
            let template = await UnitTemplate.findById( req.params.id );
            if(template === null)
                res.sendStatus(404);
            res.send("" + JSON.stringify(template));
        }catch(err){
            console.log("getTemplate error: "+ err);
            res.sendStatus(500);
        }
        
    },
    getTemplates: async (req, res) =>{
        let templates = await UnitTemplate.find({});
     //   console.log(templates);
     
        //if(templates === null)
        //    templates = "none";
        res.send("" + JSON.stringify(templates));
    },
};