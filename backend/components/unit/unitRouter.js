const express = require("express");
const useHandler = require("../../pkg/useHandler.js");
const parserJson = express.json();
const router =express.Router();
const {getUnitsInfo, getUnitsMeta, getUnitsConfig, getUnit, createUnit, deleteUnit, calcTriggers, updateUnit, updateTrigger} = require("./unitController.js");

router.post("/create", parserJson, (req, res) => useHandler(req, res,createUnit));
router.post("/delete/:id", parserJson, (req, res) => useHandler(req, res, deleteUnit));
router.put("/:id", parserJson, (req, res) => useHandler(req, res, updateUnit));
//router.put("/:id", parserJson, (req, res) => useHandler(req, res, updateTrigger));
//router.post("/update", parserJson, updateItems);

router.get("/metadata", (req, res) => useHandler(req, res, getUnitsMeta));
router.get("/config", (req, res) => useHandler(req, res, getUnitsConfig));
router.use("/calctriggers/:id", (req, res) => useHandler(req, res, calcTriggers));
router.get("/:id", (req, res) => useHandler(req, res, getUnit));
router.get("/", (req, res) => useHandler(req, res, getUnitsInfo));
module.exports = router;