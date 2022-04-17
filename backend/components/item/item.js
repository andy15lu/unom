const { ObjectId } = require("mongodb");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    unitId:{
         type: ObjectId,
         required: false,
        },
    itemTemplate:{
         type: ObjectId,
         required: true,
        },
    status:{
         type: Number,
         default: 0,
    },
    history: {type: Boolean, default:true},
    value: String,
    meta: [],
});

module.exports = new mongoose.model("Item", schema);