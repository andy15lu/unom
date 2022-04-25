const { ObjectId, Timestamp } = require("mongodb");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    unitId:{
         type: ObjectId,
         required: true,
        },
    itemTemplate:{
         type: ObjectId,
         ref: "Template.$.items",
         required: true,
        },
    status:{
         type: Number,
         default: 0,
    },
    updateTime:{type: Date},
    history: {type: Boolean, default:true},
    value: String,
    meta: [],
    
});
/*schema.virtual('code')
.get( function(){
    return "code";
})
.set(function(v){});
schema.static('getCode', function( id ) {
    
    let tmp = this.findById( id ); 
    return tmp.name;
    });*/
module.exports = new mongoose.model("Item", schema);