const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    datetime: String,
    item: {
        type:ObjectId,
        ref: "Item",
    },
    value: String,

});
module.exports = mongoose.model("History", schema);