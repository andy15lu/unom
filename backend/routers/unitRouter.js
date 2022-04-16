const express = require("express");
const parserJson = express.json();
const router =express.Router();
const {getUnitsInfo, getUnitsMeta, getUnitsConfig, createUnit, updateItems} = require("../controllers/unitController.js");

router.post("/create", parserJson, createUnit);
router.post("/update", parserJson, updateItems);

router.use("/metadata", getUnitsMeta);
router.use("/config", getUnitsConfig);
router.use("/", getUnitsInfo);
module.exports = router;