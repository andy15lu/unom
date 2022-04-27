//const {AppError,ValidationError,PropertyRequireError} = require("../../pkg/error.js");
const Item = require("./item.js");
const History = require("../history/history.js");
const Unit = require("../unit/unit.js");
const { calcTriggers } = require("../unit/unitController.js");

module.exports = {
    updateItems: async (req, res) =>{
        try{
            console.log(req.body);

            for(let i of req.body){
                let item = Object.entries(i);
           //     console.log(item[0][0]+' '+item[0][1]);
                const updatedItem = await Item.findByIdAndUpdate( item[0][0], {value: item[0][1], updateTime: new Date()}, {new: true} );

          //      console.log(updatedItem);
           //     console.log("nos="+updatedItem.nos);
                if(updatedItem["history"]){
                    let newRecord = {
                        datetime: new Date(),
                        item: updatedItem._id,
                        value: updatedItem.value,
                    }
            //        console.log(newRecord);
                    await History.create(newRecord);
                }else 
                    console.log(updatedItem.history);
                // пересчитываем триггеры после обновления item
                const unitId = await Unit.findOne({"items": {$all:[ item[0][0] ]} }, {_id:1} );
                calcTriggers({params: {id: unitId }});
                //console.log("unit[" + item[0][0] + "]: " + unitId);
            }
            //Item.update
            return {msg: "ok", data: []};
        }catch( err ){
            //console.log("Ошибка updateItem", err);
            //throw new AppError("Ошибка updateItem");//res.sendStatus(500);
            err["source"] = "updateItem";
            throw err;
        }
    },
};