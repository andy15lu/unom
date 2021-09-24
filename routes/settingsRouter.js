const express = require("express");
const settingsController = require("../controllers/settingsController.js");
const settingsRouter = express.Router();


//settingsRouter.use("/createUnit", settingsController.createUnit);
//settingsRouter.use("/editUnit", settingsController.editUnit);
//settingsRouter.use("/createModel", settingsController.createModel);
//settingsRouter.use("/postUnitModel", settingsController.postUnitModel)
settingsRouter.use("/models", settingsController.postUnitModel)
//settingsRouter.use("/test", settingsController.test);
settingsRouter.use("/", settingsController.settings);

module.exports = settingsRouter;