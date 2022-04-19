const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const Template = require("../template/template.js");
const Unit = require("./unit.js");
const Item = require("../item/item.js");
const Event = require("../event/event.js");

let getUnitsPopulated = async ( filterObj ) =>{
    const units = await Unit.find(filterObj).populate("template items");

    let unitsData = units.map( unit =>{
        let tmpItems = {};// отсюда берем информацию об item: name, type, dim
        for( let i of unit.template.items){
            tmpItems[ i._id ] = i;
        }
        let templateName = unit.template.name;
        let itemsData = unit.items.map( item => {
            let newItem = {
                _id: item._id,
                name: tmpItems[item.itemTemplate].name,
                dim: tmpItems[item.itemTemplate].dim,
                type: tmpItems[item.itemTemplate].type,
                code: tmpItems[item.itemTemplate].code,
                value: item.value,
                updateTime: item.updateTime,
                status: item.status,
                history: item.history,
                meta: item.meta,
                

            };
            return newItem;
        });
       
        return {_id: unit._id, template: unit.template.name, name: unit.name, items: itemsData, triggers: unit.triggers, constants: unit.constants};
    });
    return unitsData;
   // console.log(units);
}

module.exports = {
    getUnitsInfo: async (req) => {//информация для отображения данных пользователю (web)
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
            return JSON.stringify( {msg: "", data: unitsInfo} );
        }catch(err){
            throw("Ошибка getUnitsInfo");
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
            return JSON.stringify( {msg:"", data: unitsMeta} );
        }catch(err){
            throw("Ошибка getUnitsMeta");
        }
    },
    getUnitsConfig: async (req, res) => {// информация для интерфейса настройки
        try{
            const units = await Unit.find({}).populate("template items");
            
            let unitsConfig = units.map( unit => {
                return {name: unit.name, templateName: unit.template.name };
            });
            return JSON.stringify( {msg:"", data: unitsConfig} );
        }catch(err){
            throw("Ошибка getUnitsConfig");//res.sendStatus(500);
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
            return JSON.stringify( {msg:"", data: createdUnit });
        }catch(err){
            //console.log( err );
            throw("Ошибка createUnit");
        }
    },
    calcTriggers: async (req) =>{
        try{
            let units = await getUnitsPopulated({_id: req.params.id });

            let unit = units[0];
            if(!unit)
                throw(`Пользователь не найден ${req.params.id}`);
            let vars = {items:{}};
            let itemIds = {};
            for( let item of unit.items){
                itemIds[ item.code ] = item._id;
                vars.items[ item.code ] = item.value;
            }
            let i = 0;
            for(trigger of unit.triggers){
                let triggerFunc = new Function('items', "return " + trigger.condition);
                let newStatus = 0;
                let newState = 0;
                if( triggerFunc(vars.items) ){
                    newStatus = trigger.status;
                    newState = 1;
                }
                await Item.findByIdAndUpdate(itemIds[ trigger.targetItem ], {status: newStatus});
                if( trigger.state !== newState){
                    let updateObj = {};
                    updateObj["triggers."+i+".state"] = newState;
                    await Unit.findByIdAndUpdate(unit._id, updateObj );
                    await Event.create({trigger: trigger._id, datetime: new Date(), value: newState});
                }
                //console.log(state, triggerFunc);
                i++;
            }
            console.log( vars );
            return "done";
        }catch(err){
            console.log("", err);
            throw("Ошибка countTriggers");
        }
    },

}
/*
countTriggers: async (req) =>{
    try{

    }catch(err){
        //console.log("", err);
        throw("");
    }

},
*/