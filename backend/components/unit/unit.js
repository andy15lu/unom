const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const Item = require("./item.js.js");
//const Template = require("./template.js.js");

const schema = new Schema({

    name: {
        type: String,
    },
    template: {type: Schema.Types.ObjectId, ref: "Template"},
    items:[{
        type: Schema.Types.ObjectId, ref: "Item"}],
    triggers: [{
        name:       {type:String},
        condition:  {type:String},
        status:     {type:Number},
        code:       {type:String},
        targetItem: {type:String}, //код элемента данных на статус которого влияет триггер
    }],
});

module.exports = mongoose.model("Unit", schema);