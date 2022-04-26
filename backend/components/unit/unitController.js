const mongoose = require("mongoose");
const {AppError,ValidationError,PropertyRequireError} = require("../../pkg/error.js");
const objectId = mongoose.Types.ObjectId;
const Template = require("../template/template.js");
const Unit = require("./unit.js");
const Item = require("../item/item.js");
const Event = require("../event/event.js");
const History = require("../history/history.js");
const item = require("../item/item.js");

let getUnitsPopulated = async ( filterObj ) =>{
    const units = await Unit.find(filterObj).populate("template items");

    let unitsData = units.map( unit =>{
        let tmpItems = {};// отсюда берем информацию об item: name, type, dim
        for( let i of unit.template.items){
            tmpItems[ i._id ] = i;
        }
      
        let itemsData = unit.items.map( item => {
            let newItem = {
                _id: item._id,
                enabled: item.enabled,
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
            //const units = await Unit.find({}).populate("template items");
            const units = await getUnitsPopulated({enabled:true});
            let unitsInfo = units.map( unit =>{
                itemsInfo = unit.items.map( item => {
                    return {
                        name:   item.name, 
                        type:   item.type, 
                        dim:    item.dim, 
                        status: item.status, 
                        value:  item.value,
                    };
                });
                return {name: unit.name, items: itemsInfo};
            });
            return  {msg: "units info list", data: unitsInfo} ;
        }catch(err){
            err["source"] = "getUnitsInfo";
            throw err;
        }
    },
    getUnitsMeta: async (req) => {// информация для скрипта опроса
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
            return {msg:"units metadata list", data: unitsMeta} ;
        }catch(err){
            //throw("Ошибка getUnitsMeta");
            err["source"] = "getUnitsMeta";
            throw err;
        }
    },
    getUnitsConfig: async (req) => {// информация для интерфейса настройки
        try{
            const units = await Unit.find({}).populate("template");
            let unitsConfig = units.map( unit => {
                return {name: unit.name, templateName: unit.template.name, enadled: unit.enabled };
            });
            return {msg:"units config list", data: unitsConfig};
        }catch(err){
            //throw("Ошибка getUnitsConfig");//res.sendStatus(500);
            err["source"] = "getUnitsConfig";
            throw err;
        }
    },
    createUnit: async (req) => {
        try{
        //    console.log(req);
            //валидация запроса
      //      if(req.body.name === undefined)
     //           throw new PropertyRequireError("name");
            if(req.body.template === undefined)
                throw new PropertyRequireError("template");
            const template = await Template.findById( req.body.template );
        //    console.log(template);
            if(!template)
                throw new AppError("Шаблон не найден");
            let newUnit = {
                name : req.body.name,
                template: template["_id"],
                items: [],
                triggers: [],
            };
            for(let item of template.items){
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
            return {msg:"unit created", data: createdUnit };
        }catch(err){
            err["source"] = "createUnit";//this.constructor.name;
            throw err;
        }
    },
    deleteUnit: async (req) => {

        try{
            const unit = await Unit.findByIdAndDelete( req.params.id );
            
            for(item of unit.items){
                let deletedItem = await Item.findByIdAndDelete(item._id);
               
                try{
                    await History.findOneAndDelete({item: deletedItem._id});
                }catch(err){
                    console.log("Ошибка удаления истории", err);
                }
            }
            for(trigger of unit.triggers){
                try{
                    await Event.findOneAndDelete({trigger: trigger._id});
                }
                catch(err){
                    console.log("Ошибка удаления события", err);
                }

            }
            return JSON.stringify( {msg:"ok", data: [] });
        }catch(err){
            //console.log( err );
            throw("Ошибка deleteUnit");
        }
    },
    calcTriggers: async (req) =>{
        try{
            let units = await getUnitsPopulated({_id: req.params.id });

            let unit = units[0];
            if(!unit)
                throw new AppError(`Пользователь не найден ${req.params.id}`);
            let vars = {items:{}};
            let itemIds = {};
            for( let item of unit.items){
                itemIds[ item.code ] = item._id;
                vars.items[ item.code ] = item.value;
            }
            let i = 0;
            for(let trigger of unit.triggers){
                let triggerFunc = new Function('i', "return " + trigger.condition);
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
    //        console.log( vars );
            return JSON.stringify({msg:"ok",data:[]});
        }catch(err){
      //      console.log("", err);
            err["source"] = "calcTriggers";
            throw err;
        }
    },
    updateTrigger: async (req) =>{
        /*
        {
            id
            name
            condition
            status
            targetItem
        }
        */
       //let newTrigger = {name: "new", condition:"false", status:1, targetItem:0};
       
       let newTrigger = req.body;
       console.log(newTrigger);
       let unitUpdated = await Unit.findOneAndUpdate({'triggers._id':req.params.id},
            {$set:{
                'triggers.$.name': newTrigger.name,
                'triggers.$.condition': newTrigger.condition,
                'triggers.$.status': newTrigger.status,
                'triggers.$.targetItem': newTrigger.targetItem
            }}, {new: true});
        return JSON.stringify(unitUpdated);
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