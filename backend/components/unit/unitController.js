const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const Template = require("../temptate/template.js");
const Unit = require(".unit.js");
const Item = require("../item/item.js");



module.exports = {
    getUnitsInfo: async (req, res) => {//информация для отображения данных пользователю
        try{
            const units = await Unit.find({}).populate("template items");
            
            let unitsInfo = units.map( unit =>{
                let tmpItems = {};// отсюда берем информацию об item: name, type, dim
                for( let i of unit.template.items){
                    tmpItems[ i._id ] = i;
                }
                itemsInfo = unit.items.map( item => {
                    return {
                        name:   tmpItems[item.itemTemplate].name, 
                        type:   tmpItems[item.itemTemplate].type, 
                        dim:    tmpItems[item.itemTemplate].dim, 
                        status: tmpItems[item.itemTemplate].status, 
                        value:  item.value,
                    };
                });
                return {name: unit.name, items: itemsInfo};
            });
            res.send(JSON.stringify( {msg: "", data: unitsInfo} ));
        }catch(err){
            res.sendStatus(500);
        }
    },
    getUnitsMeta: async (req, res) => {// информация для скрипта опроса
        try{
            const units = await Unit.find({}).populate("template items");
            
            let unitsMeta = units.map( unit =>{
                let tmpItems = {};// отсюда берем информацию об item: name, type, dim
                for( let i of unit.template.items){
                    tmpItems[ i._id ] = i;
                }
                itemsMeta = unit.items.map( item => {
                    return {
                        _id:  item._id,
                        name:   tmpItems[item.itemTemplate].name, 
                        meta:   tmpItems[item.itemTemplate].meta, 
                    };
                });
                return {name: unit.name, items: itemsMeta};
            });
            res.send(JSON.stringify( {msg:"", data: unitsMeta} ));
        }catch(err){
            res.sendStatus(500);
        }
    },
    getUnitsConfig: async (req, res) => {// информация для интерфейса настройки
        try{
            const units = await Unit.find({}).populate("template items");
            
            let unitsConfig = units.map( unit => {
                return {name: unit.name, templateName: unit.template.name };
            });
            res.send(JSON.stringify( {msg:"", data: unitsConfig} ));
        }catch(err){
            res.sendStatus(500);
        }
    },
    createUnit: async (req, res) => {

        try{
            const template = await Template.findById( req.body.template );
            if(!template)
                res.sendStatus(404);
            let newUnit = {
                name : req.body.name,
                template: template["_id"],
                items: [],
                triggers: [],
            };
            for(item of template.items){
                const newItem = await Item.create({
                    itemTemplate: item["_id"],
                    value: "",
                    meta: item["meta"],
                });
                newUnit.items.push( newItem );
            }
            if(template.triggers !== undefined)
                for(trigger of template.triggers){
                    newUnit.triggers.push( {
                        name: trigger.name,
                        condition: trigger.condition,
                        status: trigger.status,
                        code: trigger.code,
                        targetItem: trigger.targetItem,
                        state: 0,
                    } );
                }
            const createdUnit = await Unit.create(newUnit);
            res.send(JSON.stringify( {msg:"", data: createdUnit }));
        }catch(err){
            console.log( err );
            res.sendStatus(500);
        }
    },

}