const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Шаблон для создания устройства
const schema = new Schema({
    name: {
        type:       String,
        required:   true,
        validate:{
            validator: (v) => {
                return v.length < 64 && /[w\p{sc=Cyrillic}-]+/.test(v);
            }
        }
    },
    code: {
        type:       String,
        required:   true,
        validate:{
            validator: (v) => {
                return v.length < 32 && !/\D+/.test(v);
            }
        }
    },
    items: [{
        name:   {
            type: String, required:true,
            validate:{
                validator: (v) => {
                    return v.length < 64 ;//&& /[w\p{sc=Cyrillic}-]+/.test(v);
                }
            }
        },
        type:   {type: String, required:false,default:"String"},
        dim:    {type: String, required:false,default:"",validate:{
            validator: (v) => {
                return v.length < 12 ;//&& /[w\p{sc=Cyrillic}-]+/.test(v);
            }
        }},
        code:   {type: String, required:true,}, // уникальное для items кодовое имя
        default:{type: String, required:false,default:""},
        meta:   {type: Array, required:true,},
    }],
    triggers: [{
        name:  {
            type:String,
            validate:{
                validator: (v) => {
                    return v.length < 64 && /[\/\w\p{sc=Cyrillic}-]+/.test(v);
                }
        }},
        condition:  {type:String},
        status:     {type:Number},
        code:       {type:String,validate:{
            validator: (v) => {
                return v.length < 32 && /\w+/.test(v);
            }
        }},
        targetItem: {type:String}, //код элемента данных на статус которого влияет триггер
    }],
    constants: [{
        code: {type:String},
        value:{type:String}
    }],
    createData: String,
    
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
        {"name": "Eb/N0 ниже нормы", "condition":"i.ebno < 8", "status": 3, "code": "ebno_alarm", "targetItem": "ebno"}
    ],

};