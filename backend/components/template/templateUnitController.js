const UnitTemplate = require("./template.js");

module.exports = {
    createTemplate: async (req)=>{
   /*     let example = {
            name: "Comtech cdm qx",
            code: "1001",
            items: [
                {name: "Eb/N0", type: "float", dim: "dB", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
                {name: "BER", type: "float", dim: "", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
            ],
        
        };*/
    const newTemplate = await UnitTemplate.create(req.body);
    if(!newTemplate)
        throw("Ошибка создания шаблона");
    return JSON.stringify({msg:"Шаблон создан", data: newTemplate});
    },
    getTemplate: async (req) =>{ //получить список всех шаблонов устройств
        try{
            let template = await UnitTemplate.findById( req.params.id );
            if(template === null)
                throw("Ошибка получения данный о шаблоне");
            return JSON.stringify(template);
        }catch(err){
            console.log("getTemplate error: "+ err);
            //res.sendStatus(500);
            throw("Ошибка получения данный о шаблоне");
        }
    },
    getTemplates: async (req) =>{
        let templates = await UnitTemplate.find({});
     //   console.log(templates);
     
        //if(templates === null)
        //    templates = "none";
        return JSON.stringify(templates);
    },
};