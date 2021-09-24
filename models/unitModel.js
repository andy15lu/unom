const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const unitModelSchema = new Schema({
    name: String,
    items: [{
        name: String,
        code: String,
        dim: String
    }]
});
module.exports = mongoose.model("unitModel", unitModelSchema, "unitModels");
