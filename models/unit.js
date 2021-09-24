
const mongoose = require("mongoose");
//const unitModel = require("../models/unitModel.js");
const Schema = mongoose.Schema;

const unitSchema = new Schema({
    name: String,
    checktime: String,
    enabled: Boolean,
    ip: String,
    unitModel: { 
    	type: Schema.Types.ObjectId, 
    	ref: 'unitModel' 
    },
    items: [{
        name: String,
        code: String,
        dim: String,
        value: String
    }]
});
module.exports = mongoose.model("Unit", unitSchema);

