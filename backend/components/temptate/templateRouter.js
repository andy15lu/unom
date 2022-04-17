const express = require("express");
const useHandler = require("../../pkg/useHandler.js");
const parserJson = express.json();
let router =  express.Router();
const {createTemplate, getTemplate, getTemplates} = require("./templateUnitController.js");

router.post("/add", parserJson, (req, res) => useHandler(req, res, createTemplate) );
router.use("/:id", getTemplate );
router.use("/",     getTemplates );

module.exports = router;