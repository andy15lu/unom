const express = require("express");
const useHandler = require("../../pkg/useHandler.js");
const parserJson = express.json();
const router =express.Router();
const {getUnitsInfo, getUnitsMeta, getUnitsConfig, createUnit, deleteUnit, calcTriggers, updateTrigger} = require("./unitController.js");

router.post("/create", parserJson, (req, res) => useHandler(req, res,createUnit));
router.post("/delete/:id", parserJson, (req, res) => useHandler(req, res, deleteUnit));
router.post("/update/trigger/:id", parserJson, (req, res) => useHandler(req, res, updateTrigger));
//router.post("/update", parserJson, updateItems);

router.use("/metadata", (req, res) => useHandler(req, res, getUnitsMeta));
router.use("/config", (req, res) => useHandler(req, res, getUnitsConfig));
router.use("/calctriggers/:id", (req, res) => useHandler(req, res, calcTriggers));
router.use("/", (req, res) => useHandler(req, res, getUnitsInfo));
module.exports = router;