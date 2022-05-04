const {AppError,ValidationError,PropertyRequireError} = require("../../pkg/error.js");
const UnitTemplate = require("./template.js");

module.exports = {
    createTemplate: async (req)=>{
    //валидация запроса
 /*   if(req.body.name === undefined)
        throw new PropertyRequireError("name");
    if(req.body.code === undefined)
        throw new PropertyRequireError("code");
    */
    try{
    if(req.body.items === undefined)
        throw new PropertyRequireError("items");

    const newTemplate = await UnitTemplate.create(req.body);
    if(!newTemplate)
        throw new AppError("Ошибка создания шаблона");
    return {msg:"Шаблон создан", data: newTemplate};
    }
    catch(err){
        err["source"] = "createTemplate";
        throw err;
    }
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