const {AppError,ValidationError,PropertyRequireError} = require("../../pkg/error.js");
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
    //валидация запроса
    if(req.body.name === undefined)
        throw new PropertyRequireError("name");
    if(req.body.code === undefined)
        throw new PropertyRequireError("code");
    if(req.body.items === undefined)
        throw new PropertyRequireError("items");

    const newTemplate = await UnitTemplate.create(req.body);
    if(!newTemplate)
        throw new AppError("Ошибка создания шаблона");
    return {msg:"Шаблон создан", data: newTemplate};
    },
    getTemplate: async (req) =>{ //получить список всех шаблонов устройств
        try{
            let template = await UnitTemplate.findById( req.params.id );
            return {msg:"", data:template};
        }catch(err){
            console.log("getTemplate error: "+ err);
            throw new Error("Ошибка получения данный о шаблоне");
        }
    },
    getTemplates: async (req) =>{
        let templates = await UnitTemplate.find({});
        //return {msg:"template list", data: [] };
        //return JSON.stringify({msg:"template list", data: [] });
        return {msg:"template list", data: templates };
        //return JSON.stringify({msg:"template list", data: templates });
    },
};