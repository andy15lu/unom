const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const Item = require("./item.js.js");
//const Template = require("./template.js.js");

const schema = new Schema({

    name: {
        type: String,
        required:true,
    },
    enabled: {
        type:Boolean,
        default:true, 
    },
    template: {type: Schema.Types.ObjectId, ref: "Template", required:true,},
    items:[{
        type: Schema.Types.ObjectId, ref: "Item"}],
    triggers: [{
        enabled: {type:Boolean},
        state:   {type:Number},
        name:    {type:String,
            validate:{
                validator: (v) => {
                    return v.length < 64 && /[\/\w\p{sc=Cyrillic}-]+/.test(v);
                }}
            },
        condition: {type:String,
            validate:{
                validator: (v) => {
                    if(v.length > 100)
                        v = v
                    return v.length < 200;
                }},
            },
        status:     {type:Number},
        code:       {type:String,validate:{
            validator: (v) => {
                return v.length < 32 && /\w+/.test(v);
            }
        }},
        targetItem: {type:String}, //код элемента данных на статус которого влияет триггер
    }],
});

module.exports = mongoose.model("Unit", schema);