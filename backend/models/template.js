const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Шаблон для создания устройства
const schema = new Schema({
    name: {
        type:       String,
        required:   true,
    },
    code: {
        type:       String,
        required:   true,
    },
    items: [{
        name:   {type: String},
        type:   {type: String},
        dim:    {type: String},
        code:    {type: String}, // уникальное для items кодовое имя
        default:{type: String},
        meta:   {type: Array},
    }],
    triggers: [{
        name:       {type:String},
        condition:  {type:String},
        status:     {type:Number},
        code:       {type:String},
        targetItem: {type:String}, //код элемента данных на статус которого влияет триггер

    }],
    
});
module.exports = mongoose.model("Template", schema);

let example = {
    name: "Comtech cdm qx",
    code: "1001",
    items: [
        {name: "Eb/N0", type: "float", dim: "dB", code:"ebno", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.1"}]},
        {name: "BER", type: "float", dim: "", code:"ber", meta:[{param:"ebno", oid:"1.3.6.1.1102.1.5.2.1.1.0.2"}]},
    ],
    triggers: [
        {"name": "Eb/N0 ниже нормы", "condition":"items.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
    ],

};