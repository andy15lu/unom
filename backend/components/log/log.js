const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    datetime: {
        type: Date,
    },
    category: {
        type: String,
    },
    level: {
        type: Number,
    },

});