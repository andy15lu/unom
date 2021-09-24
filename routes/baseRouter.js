const express = require("express");
const baseController = require("../controllers/baseController.js");
const baseRouter = express.Router();
 
baseRouter.use("/settings", baseController.settings);
baseRouter.use("/giagram", baseController.diagram);
baseRouter.use("/",  baseController.table);
 
module.exports = baseRouter;