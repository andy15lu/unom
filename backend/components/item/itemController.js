const Item = require("./item.js");
const History = require("../history/history.js");
module.exports = {
    updateItems: async (req, res) =>{
        try{
            console.log(req.body);
            
            for(let i of req.body){
                let item = Object.entries(i);
           //     console.log(item[0][0]+' '+item[0][1]);
                const updatedItem = await Item.findByIdAndUpdate( item[0][0], {value: item[0][1]}, {new: true} );
                console.log(updatedItem);
                console.log("nos="+updatedItem.nos);
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
            }
            //Item.update
            res.send(JSON.stringify( {msg: "", data: []} ));
        }catch( err ){
            console.log("Ошибка updateItem", err);
            res.sendStatus(500);
        }
    },
};