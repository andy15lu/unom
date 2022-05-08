const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    trigger:{type:  ObjectId},
    datetime:{type: Date},
    value:{type: Boolean},
});
module.exports = mongoose.model("Event", schema);